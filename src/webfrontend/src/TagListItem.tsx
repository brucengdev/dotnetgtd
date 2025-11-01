import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button, ButtonMode } from "./controls/Button"
import { Tag } from "./models/Tag"
import { EditableTextView } from "./controls/EditableTextView"

interface TagListItemProps {
    tag: Tag,
    onDelete?: () => void
    onChange?: (tag: Tag) => void
}
export function TagListItem(props: TagListItemProps) {
    const { tag, onDelete, onChange } = props
    const { name } = tag
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    return <div data-testid="tag"  className="grid grid-cols-4 mb-1 border border-gray-400">
        <EditableTextView text={name} 
            className="col-span-3"
            textViewTestId="name" 
            editViewTestId="edit-name" 
            onChange={(newName) => {
                if(onChange) {
                    onChange({...tag, name: newName})
                }
            }}
        />
        <div className="text-right">
        {!showConfirmDelete 
            && <Button text="Delete" mode={ButtonMode.DANGER}
                onClick={() => setShowConfirmDelete(true)} /> }
        </div>
        {showConfirmDelete 
        && <ConfirmDeleteView
                onYes={() => {
                    if(onDelete) {
                        onDelete()
                    }
                }}
                onNo={() => setShowConfirmDelete(false) } />}
    </div>
}