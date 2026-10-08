import type { FlowStepProps } from "../types/Types";
import { useState } from 'react';
import FlowCard from "./FlowCard";
import TypePicker from "./TypePicker";
import { SquareChevronLeft, SquareChevronRight, SquareChevronUp, SquareChevronDown } from "lucide-react";


const FlowStep = ({
  step, 
  canMoveLeft, 
  canMoveRight, 
  onMoveLeft, 
  onMoveRight, 
  onAddCard, 
  onDeleteCard, 
  onChangeCardType, 
  onDropCard, 
  onFieldChange, 
  justCreatedId,
  verticalWorkflow,
  processStarted
}: FlowStepProps) => {

  const [isOver, setIsOver] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  return (
    <div
      className={`flow-step position-relative d-flex flex-column p-3 m-2 rounded 
        ${step.cards.length > 1 ? 'border border-2 border-transparent' : 'border border-2 border-transparent'}
        ${isOver ? 'border-2 bg-light border-success' : ''}
        ${verticalWorkflow ? 'flow-step-horizontal': 'flow-step-vertical' }`
      }
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
        {canMoveLeft && (
          <button
            onClick={onMoveLeft}
            className={`btn btn-sm  translate-middle ${verticalWorkflow ? 'position-absolute top-50 start-0': 'position-absolute top-0 start-50'}`}
          >
            {verticalWorkflow ? <SquareChevronLeft fill='white' /> : <SquareChevronUp fill='white' />}
            
          </button>
        )}
        <div className="d-grid gap-2 flex-grow-1">
          {step.cards.map(card => (
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
          ))}
          <div className="position-relative d-inline-block">
            {!processStarted && 
            <button
              onClick={() => setIsPicking(true)}
              className="btn btn-sm btn-outline-secondary"
            >
              + en parallèle
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

        {canMoveRight && (
          <button
            onClick={onMoveRight}
            className={`btn btn-sm  translate-middle ${verticalWorkflow ? 'position-absolute top-50 start-100 ': 'position-absolute top-100 start-50 '}`}
          >
            {verticalWorkflow ? <SquareChevronRight fill='white' /> : <SquareChevronDown fill='white' />}
          </button>
        )}
      </div>
    </div>
  )
};

export default FlowStep