import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button, ButtonMode } from "./controls/Button"

interface ItemViewProps {
    description: string
    projectName?: string
    onDelete?: () => void
}
export default function ItemView(props: ItemViewProps) {
    const { description, onDelete } = props
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false)
    return <div data-testId="item">
        <div  className="grid grid-cols-2 mb-1">
            <div data-testId="description">{description}</div>
            <div data-testId="project">{props.projectName??""}</div>
            {showConfirmDelete
                ? <></>
                : <Button text="Delete" className="justify-self-end" mode={ButtonMode.DANGER} onClick={() => setShowConfirmDelete(true)} />}
        </div>
            {showConfirmDelete
                ?<ConfirmDeleteView onNo={() => setShowConfirmDelete(false)} onYes={onDelete} />
                : <></>}
        </div>
}