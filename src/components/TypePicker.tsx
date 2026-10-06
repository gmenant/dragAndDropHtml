import type {TypePickerProps} from "./../types/Types";
import {CircleX} from "lucide-react";
import { CARD_TYPES } from "../constants/Constantes";


const TypePicker = ({ onSelect, onCancel }: TypePickerProps) => (
  <div className="d-flex flex-column gap-1 align-items-center justify-content-center flex-wrap border p-2">
    <button
      className="p-0 border-0 bg-transparent d-inline-flex flow-card-btn-close"
      onClick={onCancel}
      aria-label="Annuler"
    >
      <CircleX />
    </button>
    {Object.values(CARD_TYPES).map(t => (
      <button
        key={t}
        className="btn btn-sm btn-outline-primary"
        onClick={() => onSelect(t)}
      >
        {t}
      </button>
    ))}
  </div>
);

export default TypePicker