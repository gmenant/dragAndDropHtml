
import { useState } from "react";
import type { FormFlowCardProps } from "./../types/Types"
import { CARD_TYPES } from "../constants/Constantes";
import { CallHttpSummary, FormSummary, MailSummary, ValidationAdminSummary } from "../components/Summaries"
import FlowCardActions from "./FlowCardActions";

const FormFlowCard = ({ card, onDelete }: FormFlowCardProps) => {
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
            name="title"
            id="title"
          >
          </input>
            {card.type === CARD_TYPES.CALLHTTP &&
            <div className="d-flex flex-column">
              <label htmlFor="URL">URL :</label>
              <input
                type="text"
                name="URL"
                id="URL"
              >
              </input>
              <label htmlFor="Headers">Headers :</label>
              <input
                type="text"
                name="Headers"
                id="Headers"
              >
              </input>
            </div>
            }
            {card.type === CARD_TYPES.FORM &&
              <input
            type="text"
            name="title"
            id="title"
          >
          </input>
            }
            {card.type === CARD_TYPES.MAIL &&
              <input
            type="text"
            name="title"
            id="title"
          >
          </input>
            }
            {card.type === CARD_TYPES.VALIDATION_ADMIN &&
              <input
            type="text"
            name="title"
            id="title"
          >
          </input>
            }
        </div>
      )}
    </>
  );
};

export default FormFlowCard;