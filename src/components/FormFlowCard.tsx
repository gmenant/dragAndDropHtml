
import { useState } from "react";
import type { FormFlowCardProps } from "./../types/Types"
import { CARD_TYPES } from "../constants/Constantes";
import { CallHttpSummary, FormSummary, MailSummary, ValidationAdminSummary } from "../components/Summaries"
import FlowCardActions from "./FlowCardActions";

const FormFlowCard = ({ card, onDelete, onFieldChange, startEditing = false }: FormFlowCardProps) => {
  const [editable, setEditable] = useState(startEditing);
  return (
    <>
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
      <FlowCardActions
        onDelete={onDelete}
        onEdit={() => setEditable((prev) => !prev)} />
      {editable && (
        <div className="form-flow-card d-flex flex-column rounded-4 p-2 mb-3 gap-1">
          <label htmlFor="title">Title :</label>
         <input
            type="text"
            className="form-control form-control-sm"
            id={`title-${card.id}`}
            value={card.content?.title?.[0] ?? ''}
            onChange={(e) => onFieldChange('title', [e.target.value])}
          />
          {card.type === CARD_TYPES.CALLHTTP &&
            <>
              <label htmlFor="URL">URL :</label>
              <input
                type="text"
                name="URL"
                className="form-control form-control-sm"
                id="URL"
                value={card.content?.requete?.join(', ') ?? ''}
                onChange={(e) => onFieldChange('requete', e.target.value.split(',').map((s) => s.trim()))}

              >
              </input>
              <label htmlFor="Headers">Headers :</label>
              <input
                type="text"
                name="Headers"
                className="form-control form-control-sm"
                id="Headers"
                value={card.content?.headers?.join(', ') ?? ''}
                onChange={(e) =>
                onFieldChange('headers', e.target.value.split(',').map((s) => s.trim()))
              }
              >
              </input>
            </>
          }
          {card.type === CARD_TYPES.FORM &&
            <>
              <label htmlFor="champs">champs :</label>
              <input
                type="text"
                name="champs"
                className="form-control form-control-sm"
                id="champs"
                value={card.content?.champs?.join(', ') ?? ''}
                onChange={e => onFieldChange('champs', e.target.value.split(',').map((s) => s.trim()))}
              />
              <label htmlFor="formatter">formatter :</label>
              <input
                type="text"
                name="formatter"
                className="form-control form-control-sm"
                id="formatter"
                value={card.content?.formatter?.join(', ') ?? ''}
                onChange={e => onFieldChange('formatter', e.target.value.split(',').map((s) => s.trim()))}
              />
              <label htmlFor="metadata">metadata :</label>
              <input
                type="text"
                name="metadata"
                className="form-control form-control-sm"
                id="metadata"
                value={card.content?.metadata?.join(', ') ?? ''}
                onChange={e => onFieldChange('metadata', e.target.value.split(',').map((s) => s.trim()))}
              />
              <label htmlFor="info">info :</label>
              <input
                type="text"
                name="info"
                className="form-control form-control-sm"
                id="info"
                value={card.content?.info?.[0] ?? ''}
                onChange={e => onFieldChange('info', e.target.value.split(',').map((s) => s.trim()))}
              />
            </>
          }
          {card.type === CARD_TYPES.MAIL &&
            <>
              <label htmlFor="to">to :</label>
              <input
                type="text"
                name="to"
                className="form-control form-control-sm"
                id="to"
                value={card.content?.to?.join(', ') ?? ''}
                onChange={e => onFieldChange('to', e.target.value.split(',').map((s) => s.trim()))}
              />
              <label htmlFor="message">message :</label>
              <input
                type="text"
                name="message"
                className="form-control form-control-sm"
                id="message"
                value={card.content?.message?.join(', ') ?? ''}
                onChange={e => onFieldChange('message', e.target.value.split(',').map((s) => s.trim()))}
              />
            </>
          }
          {card.type === CARD_TYPES.VALIDATION_ADMIN &&
            <>
              <label htmlFor="message">equipe :</label>
              <input
                type="text"
                name="equipe"
                className="form-control form-control-sm"
                id="equipe"
                value={card.content?.equipe?.join(', ') ?? ''}
                onChange={e => onFieldChange('equipe', e.target.value.split(',').map((s) => s.trim()))}
              />
              <label htmlFor="message">canal :</label>
              <input
                type="text"
                name="canal"
                className="form-control form-control-sm"
                id="canal"
                value={card.content?.canal?.join(', ') ?? ''}
                onChange={e => onFieldChange('canal', e.target.value.split(',').map((s) => s.trim()))}
              />
            </>
          }
        </div>
      )}
    </>
  );
};

export default FormFlowCard;