import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"

interface ItemViewProps {
    description: string
}
export default function ItemView(props: ItemViewProps) {
    const { description } = props
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false)
    return <div data-testId="item">
                <div data-testId="description">{description}</div>
                {showConfirmDelete
                    ?<ConfirmDeleteView />
                    : <button onClick={() => setShowConfirmDelete(true)}>Delete</button>}
        </div>
}