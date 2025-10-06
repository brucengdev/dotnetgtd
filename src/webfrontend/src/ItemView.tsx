import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button, ButtonMode } from "./controls/Button"
import { CheckBox } from "./controls/CheckBox"
import { EditableTextView } from "./controls/EditableTextView"
import { Item } from "./models/Item"

interface ItemViewProps {
    description: string
    projectName?: string
    onChange?: (item: Item) => void
    onDelete?: () => void
    tagNames?: string[]
    done: boolean
    later: boolean
    item: Item
}
export default function ItemView(props: ItemViewProps) {
    const { description, onChange, onDelete, done, later } = props
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false)
    return <div data-testId="item">
        <div  className="grid grid-cols-6 mb-1">
            <EditableTextView 
                text={description} 
                textViewTestId="description" editViewTestId="edit-description"
                onChange={newDescription => onChange?.({ 
                    description: newDescription,
                    projectId: undefined,
                    tagIds: undefined,
                    done, later,
                    id: 0
                }) } 
            />
            <div data-testId="project">{props.projectName??""}</div>
            <div data-testId="tags">{props.tagNames?.join(",") ?? ""}</div>
            <CheckBox
                label="Done"
                checked={done}
                dataTestId="done"
            />
            <CheckBox
                label="Later"
                checked={later}
                dataTestId="later"
            />
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