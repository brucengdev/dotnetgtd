import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button } from "./controls/Button"
import { Tag } from "./models/Tag"
import { EditableTextView } from "./controls/EditableTextView"

interface TagListItemProps {
    tag: Tag,
    onDelete?: () => void
    onChange?: (tag: Tag) => void
}
export function TagListItem(props: TagListItemProps) {
    const { tag, onDelete } = props
    const { name } = tag
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    return <div data-testid="tag"  className="grid grid-cols-2 mb-1">
        <EditableTextView text={name} 
            textViewTestId="name" editViewTestId="edit-name" />
        {!showConfirmDelete 
            && <Button text="Delete" 
                onClick={() => setShowConfirmDelete(true)} /> }
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