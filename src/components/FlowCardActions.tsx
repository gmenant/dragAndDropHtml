import type { FlowCardActionsProps } from "./../types/Types"
import { Pencil, Trash } from "lucide-react"

const FlowCardActions = ({ onDelete, onEdit }: FlowCardActionsProps) => {
    return (
        <div className='flow-card-actions p-2 d-grid gap-2 d-flex justify-content-between'>
            <button
                onClick={onEdit}
                className="flow-card-action"
                aria-label="Editer"
            >
                <Pencil stroke='#29438d' size={18} />
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
