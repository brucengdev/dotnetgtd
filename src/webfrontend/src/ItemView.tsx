import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"

interface ItemViewProps {
    description: string
    onDelete?: () => void
}
export default function ItemView(props: ItemViewProps) {
    const { description, onDelete } = props
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false)
    return <div data-testId="item">
                <div data-testId="description">{description}</div>
                {showConfirmDelete
                    ?<ConfirmDeleteView onNo={() => setShowConfirmDelete(false)} onYes={onDelete} />
                    : <button onClick={() => setShowConfirmDelete(true)}>Delete</button>}
        </div>
}