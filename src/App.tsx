import { Fragment, useState } from 'react';
import { Trash, SquarePlus, SquareChevronLeft, SquareChevronRight, Flag, KeyRound, Pencil, CircleX, Globe, AtSign, User, Form } from 'lucide-react';
//import { Form } from '@maif/react-forms';

const CARD_TYPES = {
  CALLHTTP: 'callHttp',
  FORM: 'Form',
  MAIL: 'Mail',
  VALIDATION_ADMIN: 'validationAdmin',
} as const;

type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES];
type Step = { id: string; cards: CardData[] };

type CallHttpContent = {
  title?: string[];
  requete?: string[];
  headers?: string[];
  corps?: string[];
  response?: string[];
};

type MailContent = {
  title?: string[];
  to?: string[];
  message?: string[];
};

type ValidationAdminContent = {
  title?: string[];
  equipe?: string[];
  canal?: string[];
};

type FormContent = {
  title?: string[];
  champs?: string[];
  formatter?: string[];
  metadata?: string[];
};

type BaseCard = { id: string; schema?: string };

type CardData =
  | (BaseCard & { type: typeof CARD_TYPES.CALLHTTP; content?: CallHttpContent })
  | (BaseCard & { type: typeof CARD_TYPES.FORM; content?: FormContent })
  | (BaseCard & { type: typeof CARD_TYPES.MAIL; content?: MailContent })
  | (BaseCard & { type: typeof CARD_TYPES.VALIDATION_ADMIN; content?: ValidationAdminContent });

type PillsRowProps = {
  label: string;
  values?: string[];
};

const PillsRow = ({ label, values }: PillsRowProps) => (
  <div className="card-summary-row">
    <dt>{label}</dt>
    <dd>
      {values?.map((v, i) => (
        <code key={`${v}-${i}`}>{v}</code>
      ))}
    </dd>
  </div>
);


  const CallHttpSummary = ({ content }: { content?: CallHttpContent }) => (
  <dl className="card-summary">
    <Globe />
    <PillsRow label="Requête" values={content?.requete} />
    <PillsRow label="Headers" values={content?.headers} />
    <PillsRow label="Corps" values={content?.corps} />
    <PillsRow label="Réponse" values={content?.response} />
  </dl>
);

const MailSummary = ({ content }: { content?: MailContent }) => (
  <dl className="card-summary">
    <AtSign />
    <PillsRow label="Destinataires" values={content?.to} />
    <PillsRow label="Message" values={content?.message} />
  </dl>
);

const ValidationAdminSummary = ({ content }: { content?: ValidationAdminContent }) => (
  <dl className="card-summary">
    <User />
    <PillsRow label="Equipe" values={content?.equipe} />
    <PillsRow label="Canal" values={content?.canal} />
  </dl>
);

const FormSummary = ({ content }: { content?: FormContent }) => (
  <dl className="card-summary">
    <Form />
    <PillsRow label="Champs" values={content?.champs} />
    <PillsRow label="Formatter" values={content?.formatter} />
    <PillsRow label="Metadata" values={content?.metadata} />
  </dl>
);



const initialSteps: Step[] = [
  { id: 'step-1', cards: [{ id: 'card-1', type: CARD_TYPES.CALLHTTP, content: { title: ["Controle conformité"], requete: [""], headers: ["Authorization"], corps: ["demand"], response: ["accept: true | false"] }, schema: "" }] },
  { id: 'step-2', cards: [{ id: 'card-2', type: CARD_TYPES.FORM, content: {}, schema: "" }, { id: 'card-3', type: CARD_TYPES.MAIL, content: {}, schema: "" }] },
  { id: 'step-3', cards: [{ id: 'card-4', type: CARD_TYPES.CALLHTTP, content: {}, schema: "" }] },
];

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
      <CircleX />
    </button>
    {Object.values(CARD_TYPES).map(t => (
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

type FormFlowCardProps = {
  card: CardData;
  onDelete: () => void;
};

const FormFlowCard = ({ card, onDelete }: FormFlowCardProps) => {
  const [editable, setEditable] = useState(false);
  //const [content, setContent] = useState({ card })
  return (
    <>
      {card.type === CARD_TYPES.CALLHTTP &&
        <CallHttpSummary/>
        }
      {card.type === CARD_TYPES.FORM &&
        <FormSummary/>
        }
      {card.type === CARD_TYPES.MAIL &&
        <MailSummary/>
        }
      {card.type === CARD_TYPES.VALIDATION_ADMIN &&
        <ValidationAdminSummary/>
        }
      {card.type}
      <FlowCardActions
        onDelete={onDelete}
        onEdit={() => setEditable((prev) => !prev)} />
      {editable && (
        <div>
          <label htmlFor="title">Title :</label>
          <input
            type="text"
            name="title"
            id="title"
            >
          </input>
          {card.type === CARD_TYPES.CALLHTTP &&
            <div>
              <input>
              </input>
              <input>
              </input>
            </div>
          }
        </div>
      )}
    </>
  );
};

type FlowCardActions = {
  onDelete: () => void;
  onEdit: () => void;
}

const FlowCardActions = ({ onDelete, onEdit }: FlowCardActions) => {
  return (
    <div className='flow-card-actions p-2 d-grid gap-2 d-flex justify-content-between'>
      <button
        onClick={onEdit}
        className=" p-0 border-0 bg-transparent d-inline-flex flow-card-btn-close"
        aria-label="Editer"
      >
        <Pencil stroke='white' size={18} />
      </button>
      <button
        onClick={onDelete}
        className=" p-0 border-0 bg-transparent d-inline-flex flow-card-btn-close"
        aria-label="Supprimer"
      >
        <Trash stroke='white' size={18} />
      </button>
    </div>
  )
}


type FlowCardProps = {
  card: CardData;
  stepId: string;
  onChangeType: (type: CardType) => void;
  onDelete: () => void;
};

const FlowCard = ({ card, stepId, onDelete }: FlowCardProps) => {
  return (
    <div className="flow-card p-4 bg-primary text-white rounded position-relative text-break"
      draggable={true}
      onDragStart={e => {
        e.dataTransfer.setData('application/json', JSON.stringify({ cardId: card.id, stepId }));
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <FormFlowCard card={card} onDelete={onDelete} />
    </div>)
};



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
