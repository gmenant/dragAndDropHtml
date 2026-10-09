
import { useState } from "react";
import type { FormFlowCardProps } from "./../types/Types"
import { CARD_TYPES, CARD_STATUS } from "../constants/Constantes";
import FlowCardActions from "./FlowCardActions";

const FormFlowCard = ({ card, onDelete, onFieldChange, startEditing = false, processStarted }: FormFlowCardProps) => {
  const [editable, setEditable] = useState(startEditing);
  return (
    <>
      {processStarted ?
        <>
          {card.status === CARD_STATUS.SUCCESS &&
            <span className="badge rounded-pill text-bg-success">Success</span>}
          {card.status === CARD_STATUS.FAILED &&
            <span className="badge rounded-pill text-bg-danger">Failed</span>}
          {card.status === CARD_STATUS.PENDING &&
            <span className="badge rounded-pill text-bg-light">Pending</span>}
        </>
        : <FlowCardActions
          onDelete={onDelete}
          onEdit={() => setEditable((prev) => !prev)}
          isEditable={editable}
        />
      }
      {editable && (
        <div className="form-flow-card d-flex flex-column rounded-2 p-2 mb-3 border-2 border border-danger-subtle">
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
          <div className='d-flex p-2 gap-2 justify-content-end'>
            <button className='btn btn-primary'>
              Save
            </button>
            <button className='btn btn-primary'>
              Reinitialiser
            </button>
          </div>
        </div>

      )}
    </>
  );
};

export default FormFlowCard;