
import { useState } from "react";
import type { FormFlowCardProps } from "./../types/Types"
import { CARD_TYPES } from "../constants/Constantes";
import { CallHttpSummary, FormSummary, MailSummary, ValidationAdminSummary } from "../components/Summaries"
import FlowCardActions from "./FlowCardActions";

const FormFlowCard = ({ card, onDelete, onFieldChange }: FormFlowCardProps) => {
  const [editable, setEditable] = useState(false);
  //const [content, setContent] = useState({ card })
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
        <div className="d-flex flex-column">
          <label htmlFor="title">Title :</label>
         <input
            type="text"
            id={`title-${card.id}`}
            value={card.content?.title?.[0] ?? ''}
            onChange={(e) => onFieldChange('title', [e.target.value])}
          />
          {card.type === CARD_TYPES.CALLHTTP &&
            <div className="d-flex flex-column">
              <label htmlFor="URL">URL :</label>
              <input
                type="text"
                name="URL"
                id="URL"
                onChange={(e) => onFieldChange('requete', e.target.value.split(',').map((s) => s.trim()))}

              >
              </input>
              <label htmlFor="Headers">Headers :</label>
              <input
                type="text"
                name="Headers"
                id="Headers"
                onChange={(e) =>
                onFieldChange('headers', e.target.value.split(',').map((s) => s.trim()))
              }
              >
              </input>
            </div>
          }
          {card.type === CARD_TYPES.FORM &&
            <div className="d-flex flex-column">
              <label htmlFor="champs">champs :</label>
              <input
                type="text"
                name="champs"
                id="champs"
                onChange={e => onFieldChange('champs', e.target.value.split(',').map((s) => s.trim()))}
              />
              <label htmlFor="formatter">formatter :</label>
              <input
                type="text"
                name="formatter"
                id="formatter"
                onChange={e => onFieldChange('formatter', e.target.value.split(',').map((s) => s.trim()))}
              />
              <label htmlFor="metadata">metadata :</label>
              <input
                type="text"
                name="metadata"
                id="metadata"
                onChange={e => onFieldChange('metadata', e.target.value.split(',').map((s) => s.trim()))}
              />
              <label htmlFor="info">info :</label>
              <input
                type="text"
                name="info"
                id="info"
                onChange={e => onFieldChange('info', e.target.value.split(',').map((s) => s.trim()))}
              />
            </div>
          }
          {card.type === CARD_TYPES.MAIL &&
            <div className="d-flex flex-column">
              <label htmlFor="to">to :</label>
              <input
                type="text"
                name="to"
                id="to"
                onChange={e => onFieldChange('to', e.target.value.split(',').map((s) => s.trim()))}
              />
              <label htmlFor="message">message :</label>
              <input
                type="text"
                name="message"
                id="message"
                onChange={e => onFieldChange('message', e.target.value.split(',').map((s) => s.trim()))}
              />
            </div>
          }
          {card.type === CARD_TYPES.VALIDATION_ADMIN &&
            <div className="d-flex flex-column">
              <label htmlFor="message">equipe :</label>
              <input
                type="text"
                name="equipe"
                id="equipe"
                onChange={e => onFieldChange('equipe', e.target.value.split(',').map((s) => s.trim()))}
              />
              <label htmlFor="message">canal :</label>
              <input
                type="text"
                name="canal"
                id="canal"
                onChange={e => onFieldChange('canal', e.target.value.split(',').map((s) => s.trim()))}
              />
            </div>
          }
        </div>
      )}
    </>
  );
};

export default FormFlowCard;