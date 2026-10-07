
import type { FlowCardProps } from "../types/Types";
import FormFlowCard from "./FormFlowCard";

const FlowCard = ({ card, stepId, onDelete, onFieldChange, startEditing }: FlowCardProps) => {
  return (
    <div className="flow-card p-2 rounded position-relative text-break"
      draggable={true}
      onDragStart={e => {
        e.dataTransfer.setData('application/json', JSON.stringify({ cardId: card.id, stepId }));
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <FormFlowCard card={card} onDelete={onDelete} onFieldChange={onFieldChange} startEditing={startEditing}/>
    </div>)
};

export default FlowCard