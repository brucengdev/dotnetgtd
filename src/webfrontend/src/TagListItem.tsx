import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button } from "./controls/Button"
import { Tag } from "./models/Tag"

interface TagListItemProps {
    tag: Tag,
    onDelete?: () => void
}
export function TagListItem(props: TagListItemProps) {
    const { tag, onDelete } = props
    const { name } = tag
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    return <div data-testid="tag"  className="grid grid-cols-2 mb-1">
        <div data-testid="name">{name}</div>
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