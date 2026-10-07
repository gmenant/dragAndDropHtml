import { CARD_TYPES } from "../constants/Constantes";

export type CardData =
  | (BaseCard & { type: typeof CARD_TYPES.CALLHTTP; content?: CallHttpContent })
  | (BaseCard & { type: typeof CARD_TYPES.FORM; content?: FormContent })
  | (BaseCard & { type: typeof CARD_TYPES.MAIL; content?: MailContent })
  | (BaseCard & { type: typeof CARD_TYPES.VALIDATION_ADMIN; content?: ValidationAdminContent });

export type Step = { id: string; cards: CardData[] };

export type FlowStepProps = {
  step: Step;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onAddCard: (type: CardType) => void;
  onDeleteCard: (cardId: string) => void;
  onChangeCardType: (cardId: string, type: CardType) => void;
  onDropCard: (fromStepId: string, cardId: string) => void;
  onFieldChange: (cardId: string, field: CardField, value: FieldValue) => void;
  justCreatedId: string | null;};

export type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES];

export type CallHttpContent = {
  title?: string[];
  requete?: string[];
  headers?: string[];
  corps?: string[];
  response?: string[];
};

export type MailContent = {
  title?: string[];
  to?: string[];
  message?: string[];
};

export type ValidationAdminContent = {
  title?: string[];
  equipe?: string[];
  canal?: string[];
};

export type FormContent = { 
  title?: string[];
  champs?: string[];
  formatter?: string[];
  metadata?: string[];
  info?: string
};

export type BaseCard = { id: string; schema?: string };


export type PillsRowProps = {
  label: string;
  values: string[];
};

export type FormFlowCardProps = {
  card: CardData;
  onDelete: () => void;
  onFieldChange: (field:CardField, value:FieldValue) => void
  startEditing?: boolean;
};

export type FlowCardActionsProps = {
  onDelete: () => void;
  onEdit: () => void;
}

export type FlowCardProps = {
  card: CardData;
  stepId: string;
  onChangeType: (type: CardType) => void;
  onDelete: () => void;
  onFieldChange: (field: CardField, value: FieldValue) => void;
  startEditing?: boolean;
};

export type TypePickerProps = {
  onSelect: (type: CardType) => void;
  onCancel: () => void;
};

export type CardField =
  | 'title' | 'requete' | 'headers' | 'corps' | 'response'
  | 'to' | 'message' | 'equipe' | 'canal'
  | 'champs' | 'formatter' | 'metadata' | 'info';

export type FieldValue = string | string[];