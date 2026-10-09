import type { FlowCardActionsProps } from "./../types/Types"
import { Pencil, Trash } from "lucide-react"

const FlowCardActions = ({ onDelete, onEdit, isEditable }: FlowCardActionsProps) => {
    return (
        <div className='flow-card-actions p-2 d-grid gap-2 d-flex justify-content-between'>
            <button
                onClick={onEdit}
                className={`flow-card-action position-relative ${isEditable ? 'border border-2 border-danger-subtle' : ''}`}                aria-label="Editer"
            >
                <Pencil stroke='#29438d' size={18}/>
                {isEditable && <span className="flow-card-action-line border border-danger-subtle" />}
            </button>
            <button
                onClick={onDelete}
                className="flow-card-action"
                aria-label="Supprimer"
            >
                <Trash stroke='#29438d' size={18} />
            </button>
        </div>
    )
}

export default FlowCardActions
