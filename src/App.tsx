import { Fragment, useState } from 'react';
import { CircleX, SquarePlus, SquareChevronLeft, SquareChevronRight, Flag, KeyRound } from 'lucide-react';

const CARD_TYPES = ['callHttp', 'Form', 'Mail'] as const;
type CardType = typeof CARD_TYPES[number];
type CardData = { id: string; type: CardType };
type Step = { id: string; cards: CardData[] };

const initialSteps: Step[] = [
  { id: 'step-1', cards: [{ id: 'card-1', type: 'callHttp' }] },
  { id: 'step-2', cards: [{ id: 'card-2', type: 'Form' }, { id: 'card-3', type: 'Mail' }] },
  { id: 'step-3', cards: [{ id: 'card-4', type: 'callHttp' }] },
];

const InsertButton = ({ onClick,  onDropCard }: { onClick: () => void,  onDropCard: (fromStepId: string, cardId: string) => void; }) => {
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
  </button>)}

type TypePickerProps = {
  onSelect: (type: CardType) => void;
  onCancel: () => void;
};

const TypePicker = ({ onSelect, onCancel }: TypePickerProps) => (
  <div className="d-flex flex-column gap-1 align-items-center justify-content-center flex-wrap border p-2">
    <button
      className="p-0 border-0 bg-transparent d-inline-flex flow-card-btn-close"
      onClick={onCancel}
      aria-label="Annuler"
    >
      <CircleX/>
    </button>
    {CARD_TYPES.map(t => (
      <button
        key={t}
        className="btn btn-sm btn-outline-primary"
        onClick={() => onSelect(t)}
      >
        {t}
      </button>
    ))}
  </div>
);


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
        <Flag size={"15px"}/>
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
        <KeyRound size={"15px"}/>
        Clé API générée
        </div>
    </div>
  );
};

type FlowCardProps = {
  card: CardData;
  stepId: string;
  onChangeType: (type: CardType) => void;
  onDelete: () => void;
};

const FlowCard = ({ card, stepId, onChangeType, onDelete }: FlowCardProps) => (
  <div className="flow-card p-4 bg-primary text-white rounded position-relative text-break"
    draggable={true}
    onDragStart={e => {
      e.dataTransfer.setData('application/json', JSON.stringify({ cardId: card.id, stepId }));
      e.dataTransfer.effectAllowed = 'move';
    }}
  >
    <button
      onClick={onDelete}
      className="position-absolute top-0 start-100 translate-middle p-0 border-0 bg-transparent d-inline-flex flow-card-btn-close"
      aria-label="Supprimer"
    >
      <CircleX fill='white'/>
    </button>
    <select
      className="form-select form-select-sm mb-2"
      value={card.type}
      onChange={e => onChangeType(e.target.value as CardType)}
    >
      {CARD_TYPES.map(t => (  
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  </div>
);

type FlowStepProps = {
  step: Step;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onAddCard: (type: CardType) => void;
  onDeleteCard: (cardId: string) => void;
  onChangeCardType: (cardId: string, type: CardType) => void;
  onDropCard: (fromStepId: string, cardId: string) => void;
};

const FlowStep = ({
  step, canMoveLeft, canMoveRight, onMoveLeft, onMoveRight, onAddCard, onDeleteCard, onChangeCardType, onDropCard,
}: FlowStepProps) => {

  const [isOver, setIsOver] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  return (
    <div
      className={`position-relative d-flex flex-column m-2 p-2 rounded ${isOver ? 'border border-primary border-2' : 'border border-2 border-transparent'
        }`}
      onDragOver={e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move'
        setIsOver(true)
      }}
      onDragLeave={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsOver(false)
      }}
      onDrop={e => {
        e.preventDefault
        setIsOver(false)
        const raw = e.dataTransfer.getData('application/json')
        if (!raw) return
        const { cardId, stepId } = JSON.parse(raw);
        onDropCard(stepId, cardId)
      }}
    >
      <div className="d-flex flex-row gap-2 align-middle align-items-center m-2" >
        {canMoveLeft && (
          <button
            onClick={onMoveLeft}
            className="btn"
          >
            <SquareChevronLeft />
          </button>
        )}
        <div className="d-grid gap-3">
          {step.cards.map(card => (
            <FlowCard
              key={card.id}
              card={card}
              stepId={step.id}
              onChangeType={type => onChangeCardType(card.id, type)}
              onDelete={() => onDeleteCard(card.id)}
            />
          ))}

          {isPicking ? (
              <TypePicker
                onSelect={type => {
                  onAddCard(type);
                  setIsPicking(false);
                }}
                onCancel={() => setIsPicking(false)}
              />
            ) : (
              <button
                onClick={() => setIsPicking(true)}
                className="btn btn-sm btn-outline-secondary"
              >
                + en parallèle
              </button>
            )}
        </div>

        {canMoveRight && (
          <button
            onClick={onMoveRight}
            className="btn"
          >
            <SquareChevronRight />

          </button>
        )}
      </div>
    </div>
  )
}
  ;

export default App;
