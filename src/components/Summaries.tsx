import type {PillsRowProps, CallHttpContent, MailContent,ValidationAdminContent, FormContent } from "./../types/Types";

const CallHttpSummary = ({ content }: { content?: CallHttpContent }) => (
  <dl className="card-summary">
    <PillsRow label="Requête" values={content?.requete ?? []} />
    <PillsRow label="Headers" values={content?.headers ?? []} />
    <PillsRow label="Corps" values={content?.corps ?? []} />
    <PillsRow label="Réponse" values={content?.response ?? []} />
  </dl>
);

const MailSummary = ({ content }: { content?: MailContent }) => (
  <dl className="card-summary">
    <PillsRow label="Destinataires" values={content?.to ?? []} />
    <PillsRow label="Message" values={content?.message ?? []} />
  </dl>
);

const ValidationAdminSummary = ({ content }: { content?: ValidationAdminContent }) => (
  <dl className="card-summary">
    <PillsRow label="Equipe" values={content?.equipe ?? []} />
    <PillsRow label="Canal" values={content?.canal ?? []} />
  </dl>
);

const FormSummary = ({ content }: { content?: FormContent }) => (
  <dl className="card-summary">
    <PillsRow label="Champs" values={content?.champs ?? []} />
    <PillsRow label="Formatter" values={content?.formatter ?? []} />
    <PillsRow label="Metadata" values={content?.metadata ?? []} />
  </dl>
);


const PillsRow = ({ label, values }: PillsRowProps) => (
  <div className="card-summary-row">
    <dt>{label}</dt>
    <dd>
      {values.filter(Boolean).map((v, i) => <code key={`${v}-${i}`}>{v}</code>)}
    </dd>
  </div>
);

export {FormSummary, ValidationAdminSummary, MailSummary, CallHttpSummary}