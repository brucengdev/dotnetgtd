import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button, ButtonMode } from "./controls/Button"

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
                    : <Button text="Delete" mode={ButtonMode.DANGER} onClick={() => setShowConfirmDelete(true)} />}
        </div>
}