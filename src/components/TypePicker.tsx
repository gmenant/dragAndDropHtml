import type {TypePickerProps} from "./../types/Types";
import {X} from "lucide-react";
import { CARD_TYPES } from "../constants/Constantes";


const TypePicker = ({ onSelect, onCancel }: TypePickerProps) => (
  <div 
    className="position-absolute top-50 start-50 translate-middle-x mt-1 bg-white shadow rounded border px-2 pb-2 d-flex flex-column gap-1 align-items-center"
    style={{ zIndex: 1000 }}
  >
    <button
      className="flow-card-btn-close p-0 border-0 d-flex align-items-center justify-content-center align-self-stretch"
      onClick={onCancel}
      aria-label="Annuler"
    >
      <X/>
    </button>
    {Object.values(CARD_TYPES).map(t => (
      <button
        key={t}
        className="btn btn-sm btn-outline-primary align-self-stretch"
        onClick={() => onSelect(t)}
      >
        {t}
      </button>
    ))}
  </div>
);

export default TypePicker