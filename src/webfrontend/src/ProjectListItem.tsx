import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button } from "./controls/Button"

interface ProjectListItemProps {
    name: string
}
export function ProjectListItem({name}: ProjectListItemProps) {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    return <div data-testid="project"  className="grid grid-cols-2 mb-1">
        <div data-testid="name">{name}</div>
        {!showConfirmDelete 
            && <Button text="Delete" 
                onClick={() => setShowConfirmDelete(true)} /> }
        {showConfirmDelete 
        && <ConfirmDeleteView onNo={() => setShowConfirmDelete(false)} />}
    </div>
}