import type { FlowStepProps } from "../types/Types";
import { useState } from 'react';
import FlowCard from "./FlowCard";
import TypePicker from "./TypePicker";
import { SquareChevronLeft, SquareChevronRight } from "lucide-react";


const FlowStep = ({
  step, canMoveLeft, canMoveRight, onMoveLeft, onMoveRight, onAddCard, onDeleteCard, onChangeCardType, onDropCard, onFieldChange
}: FlowStepProps) => {

  const [isOver, setIsOver] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  return (
    <div
      className={`position-relative d-flex flex-column p-2 m-2 rounded 
        ${step.cards.length>1 ? 'border border-2 border-transparent': ''}
        ${isOver ? 'border-2 bg-light' : ''
        }`}
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
      <div className="d-flex flex-row align-middle align-items-center" >
        {canMoveLeft && (
          <button
            onClick={onMoveLeft}
            className="btn btn-sm position-absolute top-50 start-0 translate-middle"
          >
            <SquareChevronLeft />
          </button>
        )}
        <div className="d-grid gap-3">
          {step.cards.map(card => (
            <FlowCard
              key={card.id}
              card={card}
              stepId={step.id}
              onChangeType={type => onChangeCardType(card.id, type)}
              onDelete={() => onDeleteCard(card.id)}
              onFieldChange={(field, value) => onFieldChange(card.id, field, value)}
            />
          ))}

          {isPicking ? (
            <TypePicker
              onSelect={type => {
                onAddCard(type);
                setIsPicking(false);
              }}
              onCancel={() => setIsPicking(false)}
            />
          ) : (
            <button
              onClick={() => setIsPicking(true)}
              className="btn btn-sm btn-outline-secondary"
            >
              + en parallèle
            </button>
          )}
        </div>

        {canMoveRight && (
          <button
            onClick={onMoveRight}
            className="btn btn-sm position-absolute top-50 start-100 translate-middle"
          >
            <SquareChevronRight />

          </button>
        )}
      </div>
    </div>
  )
};

export default FlowStep