import type {TypePickerProps} from "./../types/Types";
import {CircleX} from "lucide-react";
import { CARD_TYPES } from "../constants/Constantes";


const TypePicker = ({ onSelect, onCancel }: TypePickerProps) => (
  <div   className="position-absolute top-100 start-50 translate-middle-x mt-1 bg-white shadow rounded border p-2 d-flex flex-column gap-1 align-items-center"
  style={{ zIndex: 1000 }}>
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