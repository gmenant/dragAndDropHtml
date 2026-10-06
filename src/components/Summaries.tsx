import type {PillsRowProps, CallHttpContent, MailContent,ValidationAdminContent, FormContent } from "./../types/Types";
import {Globe,AtSign,User,Form} from "lucide-react"


const CallHttpSummary = ({ content }: { content?: CallHttpContent }) => (
  <dl className="card-summary">
    <div className="card-summary-title d-flex gap-1">
      <div className="card-summary-icone">
        <Globe size ={16}/>
      </div>
      <div>
          HTTP
        <h6>
          {content?.title}
        </h6>
      </div>
    </div>
    <PillsRow label="Requête" values={content?.requete} />
    <PillsRow label="Headers" values={content?.headers} />
    <PillsRow label="Corps" values={content?.corps} />
    <PillsRow label="Réponse" values={content?.response} />
  </dl>
);

const MailSummary = ({ content }: { content?: MailContent }) => (
  <dl className="card-summary">
    <div className="card-summary-title d-flex gap-1">
      <div className="card-summary-icone">
        <AtSign size ={16}/>
      </div>
      <div>
          MAIL
        <h6>
          {content?.title}
        </h6>
      </div>
    </div>
    <PillsRow label="Destinataires" values={content?.to} />
    <PillsRow label="Message" values={content?.message} />
  </dl>
);

const ValidationAdminSummary = ({ content }: { content?: ValidationAdminContent }) => (
  <dl className="card-summary">
    <div className="card-summary-title d-flex gap-1">
      <div className="card-summary-icone">
        <User size ={16}/>
      </div>
      <div>
          VALIDATION ADMIN
        <h6>
          {content?.title}
        </h6>
      </div>
    </div>
    <PillsRow label="Equipe" values={content?.equipe} />
    <PillsRow label="Canal" values={content?.canal} />
  </dl>
);

const FormSummary = ({ content }: { content?: FormContent }) => (
  <dl className="card-summary">
    <div className="card-summary-title d-flex gap-1">
      <div className="card-summary-icone">
        <Form size ={16}/>
      </div>
      <div>
          FORMULAIRE
        <h6>
          {content?.title}
        </h6>
      </div>
    </div>
    <PillsRow label="Champs" values={content?.champs} />
    <PillsRow label="Formatter" values={content?.formatter} />
    <PillsRow label="Metadata" values={content?.metadata} />
  </dl>
);


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

export {FormSummary, ValidationAdminSummary, MailSummary, CallHttpSummary}