import type { FlowStepProps } from "../types/Types";
import { useState } from 'react';
import FlowCard from "./FlowCard";
import TypePicker from "./TypePicker";

const FlowStep = ({
  step, 
  onAddCard, 
  onDeleteCard, 
  onChangeCardType, 
  onDropCard, 
  onFieldChange, 
  justCreatedId,
  verticalWorkflow,
  processStarted,
  boxRef
}: FlowStepProps) => {

  const [isOver, setIsOver] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  return (
    <div
      className={`flow-step position-relative d-flex flex-column p-2 m-2 bg-light
        ${isOver ? 'border-2 glowing-box' : ''}
        ${verticalWorkflow ? 'flow-step-horizontal': 'flow-step-vertical' }`
      }
      ref={boxRef}
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
      <div className="d-flex flex-row align-middle align-items-center w-100" >
        <div className="d-grid gap-2 flex-grow-1">
          {step.cards.map(card => (
            <div key={card.id} data-card-id={card.id}>
              <FlowCard
                key={card.id}
                card={card}
                stepId={step.id}
                onChangeType={type => onChangeCardType(card.id, type)}
                onDelete={() => onDeleteCard(card.id)}
                onFieldChange={(field, value) => onFieldChange(card.id, field, value)}
                startEditing={card.id === justCreatedId}
                processStarted={processStarted}
              />
            </div>
          ))}
          <div className="position-relative d-flex justify-content-center">
            {!processStarted && 
            <button
              onClick={() => setIsPicking(true)}
              className="btn btn-sm btn-outline-primary"
            >
              + Action en parallèle
            </button>
            }
            {isPicking && (
              <TypePicker
                onSelect={(type) => {
                  onAddCard(type);
                  setIsPicking(false);
                }}
                onCancel={() => setIsPicking(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
};

export default FlowStep