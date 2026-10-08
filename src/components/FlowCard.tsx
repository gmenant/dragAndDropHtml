
import type { FlowCardProps, CardType, CardData } from "../types/Types";
import FormFlowCard from "./FormFlowCard";
import { CallHttpSummary, FormSummary, MailSummary, ValidationAdminSummary } from "../components/Summaries"
import { CARD_TYPES } from "../constants/Constantes";

import { Globe, Mail, FileText, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type CardMeta = { icon: LucideIcon; label: string };

const CARD_META: Record<CardType, CardMeta> = {
  [CARD_TYPES.CALLHTTP]: { icon: Globe, label: 'HTTP' },
  [CARD_TYPES.FORM]: { icon: FileText, label: 'Formulaire' },
  [CARD_TYPES.MAIL]: { icon: Mail, label: 'Mail' },
  [CARD_TYPES.VALIDATION_ADMIN]: { icon: ShieldCheck, label: 'Validation' },
};

type CardHeaderProps = {
  card: CardData;
  stepId: string;
};

const CardHeader = ({ card, stepId }: CardHeaderProps) => {
  const { icon: Icon, label } = CARD_META[card.type];

  return (
    <div className="card-summary-title d-flex gap-1">
      <div
        draggable
        onDragStart={(e) => {
          const cardEl = e.currentTarget.closest('.flow-card') as HTMLElement | null;
          e.dataTransfer.setData(
            'application/json',
            JSON.stringify({ cardId: card.id, stepId })
          );
          e.dataTransfer.effectAllowed = 'move';

          if (cardEl) {
              const cardRect = cardEl.getBoundingClientRect();
              // décalage pour que la carte reste "tenue" à l'endroit où on a cliqué
              e.dataTransfer.setDragImage(
                cardEl,
                e.clientX - cardRect.left,
                e.clientY - cardRect.top
              );
            }
        }}
      >
        <GripVertical size={14} className="cursor-pointer"/>
      </div>
      <div className="card-summary-icone">
        <Icon size={16} />
      </div>
      <div>
        {label}
        <h6>{card.content?.title?.[0]}</h6>
      </div>
    </div>
  );
};

import { GripVertical } from "lucide-react"


const FlowCard = ({ card, stepId, onDelete, onFieldChange, startEditing, processStarted }: FlowCardProps) => {
  return (
    <div className="flow-card p-2 rounded text-break">
      <div className='d-flex flex-column column-gap-2'>
        <CardHeader card={card} stepId={stepId} />
        {card.type === CARD_TYPES.CALLHTTP &&
          <CallHttpSummary content={card.content} />
        }
        {card.type === CARD_TYPES.FORM &&
          <FormSummary content={card.content} />
        }
        {card.type === CARD_TYPES.MAIL &&
          <MailSummary content={card.content} />
        }
        {card.type === CARD_TYPES.VALIDATION_ADMIN &&
          <ValidationAdminSummary content={card.content} />
        }
      </div>
      <FormFlowCard card={card} onDelete={onDelete} onFieldChange={onFieldChange} startEditing={startEditing} processStarted= {processStarted}/>
    </div>)
};

export default FlowCard