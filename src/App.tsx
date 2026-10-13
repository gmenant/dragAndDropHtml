import { Fragment, useState} from 'react';
import { SquarePlus, Flag, KeyRound } from 'lucide-react';
import { CARD_TYPES, CARD_STATUS } from './constants/Constantes';
import type { CardData, Step, CardType, CardField, FieldValue, InsertSlotProps } from "./types/Types"
import TypePicker from "./components/TypePicker"
import FlowStep from './components/FlowStep';
import { useFleches } from "./hooks/useFleches";
import { FlowArrows } from "./components/FlowArrows";

const initialSteps: Step[] = [
  {
    id: 'step-1',
    cards: [{
      id: 'card-1',
      type: CARD_TYPES.CALLHTTP,
      content: {
        title: ['Contrôle conformité'],
        requete: ["POST https://conformite.example.org/daikoku/check"],
        headers: ['Authorization'],
        corps: ['demand'],
        response: ['accept: true | false'],
      },
      status: CARD_STATUS.SUCCESS
    }],
  },
  {
    id: 'step-2', cards: [
      {
        id: 'card-2', type: CARD_TYPES.FORM, content: {
          title: ['Motivation'],
          champs: ["motivation"],
          formatter: ["[[motivation]] (env: [[environnement]]"],
          metadata: ["environnement"],
          info: "Décris ton cas d'usage"
        },
        schema: "",
        status: CARD_STATUS.PENDING
      },
      {
        id: 'card-3', type: CARD_TYPES.MAIL, content: {
          title: ['Validation par mail'],
          to: ["rssi@example.org", "adjoint-rssi@example.org"],
          message: ["Merci de valider l’accès à l’API Sinistres."]
        },
        schema: "",
        status: CARD_STATUS.PENDING
      }
    ]
  },
  {
    id: 'step-3', cards: [{
      id: 'card-4', type: CARD_TYPES.CALLHTTP, content: {
        title: ['Contrôle conformité'],
        requete: ["POST https://conformite.example.org/daikoku/check"],
        headers: ["Authorization", "X-Source"],
        corps: ["demand", "api", "plan", "user", "team"],
        response: ["accept: true | false"]
      }, schema: "",
      status: CARD_STATUS.PENDING
    }]
  },
];


const InsertSlot = ({
  isPicking,
  onOpen,
  onCancel,
  onSelect,
  onDropCard,
}: InsertSlotProps) => {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`render-slot position-relative d-flex align-self-stretch render-slot-horizontal
        }`}
      style={{ zIndex: 2 }}
    >
      <div className="position-relative" style={{ width: '33.333%', minWidth: 48 }}>
        <button
          type="button"
          onClick={onOpen}
          className={`flow-step-add border-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-3 ${isOver ? 'bg-success-subtle' : 'bg-transparent'}`}
          style={{ padding: '0.75rem' }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setIsOver(true);
          }}
          onDragLeave={() => setIsOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsOver(false);
            const raw = e.dataTransfer.getData('application/json');
            if (!raw) return;
            const { cardId, stepId } = JSON.parse(raw);
            onDropCard(stepId, cardId);
          }}
        >
          <SquarePlus
            size={32}
            strokeWidth="1"
            fill="white"
            style={{ pointerEvents: 'none' }}
          />
        </button>

        {isPicking && <TypePicker onSelect={onSelect} onCancel={onCancel} />}
      </div>
    </div>
  );
};


const App = () => {

  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [pickingAt, setPickingAt] = useState<number | null>(null);
  const [justCreatedId, setJustCreatedId] = useState<string | null>(null);
  const [processStarted, setActiveProcess] = useState(false)

  const { arrows, containerRef, stepRefs, demandeRef, cleApiRef } =
    useFleches(steps, processStarted);

  const newCard = (type: CardType = 'CallHttp'): CardData => ({
    id: crypto.randomUUID(),
    type
  });

  const insertStepProcess = (index: number, type: CardType) => {
    const card = newCard(type);
    setJustCreatedId(card.id);
    setSteps(prev => [
      ...prev.slice(0, index),
      { id: crypto.randomUUID(), cards: [card] },
      ...prev.slice(index),
    ]);
    setPickingAt(null);
  };

  const updateCardType = (stepId: string, cardId: string, type: CardType) =>
    setSteps(prev =>
      prev.map(s =>
        s.id === stepId
          ? { ...s, cards: s.cards.map(c => (c.id === cardId ? { ...c, type } : c)) }
          : s
      )
    );

  const addCard = (stepId: string, type: CardType) => {
    const card = newCard(type);
    setJustCreatedId(card.id);
    setSteps(prev =>
      prev.map(s =>
        s.id === stepId ? { ...s, cards: [...s.cards, card] } : s
      )
    );
  };

  const deleteCard = (stepId: string, cardId: string) =>
    setSteps(prev =>
      prev
        .map(s => (s.id === stepId ? { ...s, cards: s.cards.filter(c => c.id !== cardId) } : s))
        .filter(s => s.cards.length > 0) // une étape vide disparaît
    );

  const moveCard = (fromStepId: string, cardId: string, toStepId: string) =>
    setSteps(prev => {
      if (fromStepId === toStepId) return prev
      const card = prev.find(step => step.id === fromStepId)?.cards.find(c => c.id === cardId);
      if (!card) return prev

      return prev.map(step => {
        if (step.id === fromStepId) return { ...step, cards: step.cards.filter(c => c.id !== cardId) };
        if (step.id === toStepId) return { ...step, cards: [...step.cards, card] };
        return step;
      })
        .filter(step => step.cards.length > 0)
    });

  const moveCardToNewStep = (fromStepId: string, cardId: string, insertIndex: number) =>
    setSteps(prev => {
      const card = prev.find(s => s.id === fromStepId)?.cards.find(c => c.id === cardId);
      if (!card) return prev;

      const newStep: Step = { id: crypto.randomUUID(), cards: [card] };
      const withNew = [...prev.slice(0, insertIndex), newStep, ...prev.slice(insertIndex)];

      return withNew
        .map(s =>
          s.id === fromStepId ? { ...s, cards: s.cards.filter(c => c.id !== cardId) } : s
        )
        .filter(s => s.cards.length > 0);
    });

  const updateCardField = (
    stepId: string,
    cardId: string,
    field: CardField,
    value: FieldValue
  ) =>
    setSteps((prev) =>
      prev.map((step) =>
        step.id !== stepId
          ? step
          : {
            ...step,
            cards: step.cards.map((c) =>
              c.id === cardId
                ? ({ ...c, content: { ...c.content, [field]: value } } as CardData)
                : c
            ),
          }
      )
    );

  return (
    <div className='w-100 overflow-x-auto'>
      <div className='d-grid gap-2 d-md-flex p-2'>
        <button
          type="button"
          className="btn btn-secondary"
          aria-pressed="true"
          onClick={() => setActiveProcess(!processStarted)}
        >
          {processStarted ? 'desactiver process' : 'activer process'}
        </button>
      </div>
      <div
        ref={containerRef}
        className={`flow-nodes position-relative d-flex flex-nowrap align-items-center p-3 flex-nowrap flex-column'
          }`}
        style={{ width: "max-content", minWidth: "100%" }}
      >
        <FlowArrows arrows={arrows} />
        <div ref={demandeRef} className={`badge rounded-pill p-2 px-3 m-2 border border-2 ${!processStarted ? 'bg-light text-black' : 'bg-success p-2 text-white bg-opacity-75'}`}>
          <Flag size={"15px"} />
          Demande
        </div>
        {steps.map((step, index) => (
          <Fragment key={step.id}>
            {!processStarted &&
              <InsertSlot
                isPicking={pickingAt === index}
                onOpen={() => setPickingAt(index)}
                onCancel={() => setPickingAt(null)}
                onSelect={(type) => insertStepProcess(index, type)}
                onDropCard={(fromStepId, cardId) =>
                  moveCardToNewStep(fromStepId, cardId, index)
                }
              />}
            <FlowStep
              step={step}
              onAddCard={type => addCard(step.id, type)}
              onDeleteCard={cardId => deleteCard(step.id, cardId)}
              onChangeCardType={(cardId, type) => updateCardType(step.id, cardId, type)}
              onDropCard={(fromStepId, cardId) => moveCard(fromStepId, cardId, step.id)}
              onFieldChange={(cardId, field, value) => updateCardField(step.id, cardId, field, value)}
              justCreatedId={justCreatedId}
              processStarted={processStarted}
              boxRef={(el) => { stepRefs.current[step.id] = el; }}
            />
          </Fragment>
        ))}
        {!processStarted && <InsertSlot
          isPicking={pickingAt === steps.length}
          onOpen={() => setPickingAt(steps.length)}
          onCancel={() => setPickingAt(null)}
          onSelect={(type) => insertStepProcess(steps.length, type)}
          onDropCard={(fromStepId, cardId) =>
            moveCardToNewStep(fromStepId, cardId, steps.length)
          }
        />}
        <div ref={cleApiRef} className='rounded-pill bg-light p-2 px-3 m-2 border border-2'>
          <KeyRound size={"15px"} />
          Clé API générée
        </div>
      </div>
    </div>
  );
};

export default App;
