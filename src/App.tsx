import { Fragment, useState } from 'react';
import { SquarePlus, Flag, KeyRound } from 'lucide-react';
import { CARD_TYPES } from './constants/Constantes';
import type { CardData, FlowCardProps, Step, CardType } from "./types/Types"
import FormFlowCard from "./components/FormFlowCard"
import TypePicker from "./components/TypePicker"
import FlowStep from './components/FlowStep';

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
        schema: ""
      },
      {
        id: 'card-3', type: CARD_TYPES.MAIL, content: {
          title: ['Validation par mail'],
          to: ["rssi@example.org", "adjoint-rssi@example.org"],
          message: ["Merci de valider l’accès à l’API Sinistres."]
        },
        schema: ""
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
      }, schema: ""
    }]
  },
];


const FlowCard = ({ card, stepId, onDelete }: FlowCardProps) => {
  return (
    <div className="flow-card p-2 rounded position-relative text-break"
      draggable={true}
      onDragStart={e => {
        e.dataTransfer.setData('application/json', JSON.stringify({ cardId: card.id, stepId }));
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <FormFlowCard card={card} onDelete={onDelete} />
    </div>)
};

const InsertButton = ({ onClick, onDropCard }: { onClick: () => void, onDropCard: (fromStepId: string, cardId: string) => void; }) => {
  const [isOver, setIsOver] = useState(false);
  return (
    <button
      onClick={onClick}
      className={`flow-step-add border-0 bg-transparent ${isOver ? 'btn' : 'btn-success'} `}
      onDragOver={e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={e => {
        e.preventDefault();
        setIsOver(false);
        const raw = e.dataTransfer.getData('application/json');
        if (!raw) return;
        const { cardId, stepId } = JSON.parse(raw);
        onDropCard(stepId, cardId);
      }}
    >
      <SquarePlus />
    </button>)
}

const App = () => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [pickingAt, setPickingAt] = useState<number | null>(null);

  const newCard = (type: CardType = 'callHttp'): CardData => ({ id: crypto.randomUUID(), type });

  const renderSlot = (index: number) =>
    pickingAt === index ? (
      <TypePicker
        onSelect={type => insertStepProcess(index, type)}
        onCancel={() => setPickingAt(null)}
      />
    ) : (
      <InsertButton
        onClick={() => setPickingAt(index)}
        onDropCard={(fromStepId, cardId) => moveCardToNewStep(fromStepId, cardId, index)}
      />
    );

  const insertStepProcess = (index: number, type: CardType) => {
    setSteps(prev => [
      ...prev.slice(0, index),
      { id: crypto.randomUUID(), cards: [newCard(type)] },
      ...prev.slice(index),
    ])
    setPickingAt(null)
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

  const addCard = (stepId: string, type: CardType) =>
    setSteps(prev =>
      prev.map(s =>
        s.id === stepId ? { ...s, cards: [...s.cards, newCard(type)] } : s
      )
    );

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

  return (
    <div className="flow-nodes d-flex flex-row flex-wrap align-items-center p-3">
      <div className='rounded-pill bg-light p-2 px-3 m-2 border border-2'>
        <Flag size={"15px"} />
        Demande
      </div>
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          {renderSlot(index)}
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
          />
        </Fragment>
      ))}
      {renderSlot(steps.length)}
      <div className='rounded-pill bg-light p-2 px-3 m-2 border border-2'>
        <KeyRound size={"15px"} />
        Clé API générée
      </div>
    </div>
  );
};

export default App;
