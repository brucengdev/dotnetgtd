import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button, ButtonMode } from "./controls/Button"

interface ItemViewProps {
    description: string
    projectName?: string
    onDelete?: () => void
    tagNames?: string[]
    done: boolean
    later: boolean
}
export default function ItemView(props: ItemViewProps) {
    const { description, onDelete, done, later } = props
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false)
    return <div data-testId="item">
        <div  className="grid grid-cols-6 mb-1">
            <div data-testId="description">{description}</div>
            <div data-testId="project">{props.projectName??""}</div>
            <div data-testId="tags">{props.tagNames?.join(",") ?? ""}</div>
            <label>
                Done
                <input type="checkbox" data-testId="done" checked={done} />
            </label>
            <label>
                Later
                <input type="checkbox" data-testId="later" checked={later} />
            </label>
            {showConfirmDelete
                ? <></>
                : <Button text="Delete" className="justify-self-end" 
                    mode={ButtonMode.DANGER} 
                    onClick={() => setShowConfirmDelete(true)} />}
        </div>
            {showConfirmDelete
                ?<ConfirmDeleteView onNo={() => setShowConfirmDelete(false)} 
                    onYes={onDelete} />
                : <></>}
        </div>
}