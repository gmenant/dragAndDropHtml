import { Fragment, useState, type ReactNode } from 'react';
import { SquarePlus, Flag, KeyRound } from 'lucide-react';
import { CARD_TYPES, CARD_STATUS } from './constants/Constantes';
import type { CardData, Step, CardType, CardField, FieldValue, InsertSlotProps } from "./types/Types"
import TypePicker from "./components/TypePicker"
import FlowStep from './components/FlowStep';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const buttonStyle = {
  padding: '10px 15px',
  fontSize: '14px',
  cursor: 'pointer',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

type InfiniteCanvasProps = { children: ReactNode };

function InfiniteCanvas({ children }: InfiniteCanvasProps) {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f2f5', overflow: 'hidden' }}>

      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        minScale={0.2} // Limite maximale du dézoom (20%)
        maxScale={8}   // Limite maximale du zoom (800%)
        centerOnInit
        limitToBounds={false} // Permet de se déplacer à l'infini en dehors des limites
      >
        {({ zoomIn, zoomOut, resetTransform, zoomToElement }) => (
          <>
            <div style={{ position: 'absolute', zIndex: 10, bottom: 20, left: 20, display: 'flex', gap: '10px' }}>
              <button onClick={() => zoomToElement('flow-content', 1, 300)}>🔄 Centrer</button>
              <button onClick={() => zoomIn()} style={buttonStyle}>➕ Zoom</button>
              <button onClick={() => zoomOut()} style={buttonStyle}>➖ Dézoom</button>
              <button onClick={() => resetTransform()} style={buttonStyle}>🔄 Centrer</button>
            </div>

            {/* Zone du Canevas */}
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{
                width: '50  00px',  // Une grande zone virtuelle
                height: '5000px',
                backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', // Grille de fond
                backgroundSize: '20px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {children}

            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

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

const App = () => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [pickingAt, setPickingAt] = useState<number | null>(null);
  const [justCreatedId, setJustCreatedId] = useState<string | null>(null);
  const [verticalWorkflow, setVerticalWorkflow] = useState<boolean>(false)
  const [processStarted, setActiveProcess] = useState(false)


  const newCard = (type: CardType = 'CallHttp'): CardData => ({
    id: crypto.randomUUID(),
    type
  });

  const InsertSlot = ({
    verticalWorkflow,
    isPicking,
    onOpen,
    onCancel,
    onSelect,
    onDropCard,
  }: InsertSlotProps) => {
    const [isOver, setIsOver] = useState(false);

    return (
      <div
        className={`render-slot position-relative d-flex ${verticalWorkflow
          ? 'align-self-stretch render-slot-horizontal'
          : 'align-self-center render-slot-vertical'
          }`}
      >
        <button
          type="button"
          onClick={onOpen}
          className={`flow-step-add border-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-3 ${isOver ? 'bg-success-subtle' : 'bg-transparent'
            }`}
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
          <SquarePlus style={{ pointerEvents: 'none' }} />
        </button>

        {isPicking && <TypePicker onSelect={onSelect} onCancel={onCancel} />}
      </div>
    );
  };

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

  const moveStep = (index: number, direction: -1 | 1) =>
    setSteps(prev => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

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
    <div>
      <InfiniteCanvas>
        <div id="flow-content">
          <div className='d-grid gap-2 d-md-flex p-2'>
            <button
              className='btn btn-primary'
              onClick={() => setVerticalWorkflow(!verticalWorkflow)}>
              {verticalWorkflow ? 'passer a verticale' : 'passer à l\'horizontal'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              aria-pressed="true"
              onClick={() => setActiveProcess(!processStarted)}
            >
              {processStarted ? 'desactiver process' : 'activer process'}
            </button>
          </div>
          <div className={`flow-nodes d-flex flex-wrap align-items-center p-3 ${verticalWorkflow ? 'flex-row' : 'flex-column'}`}>
            <div className={`badge rounded-pill p-2 px-3 m-2 border border-2 ${!processStarted ? 'bg-light text-black' : 'bg-success p-2 text-white bg-opacity-75'}`}>
              <Flag size={"15px"} />
              Demande
            </div>
            {steps.map((step, index) => (
              <Fragment key={step.id}>
                {!processStarted &&
                  <InsertSlot
                    verticalWorkflow={verticalWorkflow}
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
                  canMoveLeft={index > 0}
                  canMoveRight={index < steps.length - 1}
                  onMoveLeft={() => moveStep(index, -1)}
                  onMoveRight={() => moveStep(index, 1)}
                  onAddCard={type => addCard(step.id, type)}
                  onDeleteCard={cardId => deleteCard(step.id, cardId)}
                  onChangeCardType={(cardId, type) => updateCardType(step.id, cardId, type)}
                  onDropCard={(fromStepId, cardId) => moveCard(fromStepId, cardId, step.id)}
                  onFieldChange={(cardId, field, value) => updateCardField(step.id, cardId, field, value)}
                  justCreatedId={justCreatedId}
                  verticalWorkflow={verticalWorkflow}
                  processStarted={processStarted}
                />
              </Fragment>
            ))}
            {!processStarted && <InsertSlot
              verticalWorkflow={verticalWorkflow}
              isPicking={pickingAt === steps.length}
              onOpen={() => setPickingAt(steps.length)}
              onCancel={() => setPickingAt(null)}
              onSelect={(type) => insertStepProcess(steps.length, type)}
              onDropCard={(fromStepId, cardId) =>
                moveCardToNewStep(fromStepId, cardId, steps.length)
              }
            />}
            <div className='rounded-pill bg-light p-2 px-3 m-2 border border-2'>
              <KeyRound size={"15px"} />
              Clé API générée
            </div>
          </div>
        </div>
      </InfiniteCanvas>
    </div>
  );
};

export default App;
