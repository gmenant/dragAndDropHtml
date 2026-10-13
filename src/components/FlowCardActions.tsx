import type { FlowCardActionsProps } from "./../types/Types"
import { Pencil, Trash } from "lucide-react"

const FlowCardActions = ({ onDelete, onEdit, isEditable }: FlowCardActionsProps) => {
    return (
        <div className="flow-card-actions mx-n2 mb-n2">
            <div className='d-flex justify-content-between gap-2 p-2'>
                <button
                    type="button"
                    onClick={onDelete}
                    className="flow-card-action btn btn-outline-secondary"
                    aria-label="Supprimer"
                >
                    <Trash stroke="#29438d" size={18} aria-hidden="true" />
                    Supprimer
                </button>
                <button
                    type="button"
                    onClick={onEdit}
                    className={`flow-card-action position-relative btn btn-outline-secondary ${isEditable ? 'border border-2' : ''
                        }`}
                    aria-label="Éditer"
                    aria-pressed={isEditable}
                >
                    <Pencil stroke="#29438d" size={18} aria-hidden="true" />
                    Modifier
                </button>
            </div>
        </div>
    );
};

export default FlowCardActions
