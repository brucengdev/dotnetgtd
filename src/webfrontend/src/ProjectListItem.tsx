import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button } from "./controls/Button"
import { CheckBox } from "./controls/CheckBox"

interface ProjectListItemProps {
    name: string,
    onDelete?: () => void
    later: boolean
}
export function ProjectListItem(props: ProjectListItemProps) {
    const { name, later, onDelete } = props
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    return <div data-testid="project"  className="grid grid-cols-3 mb-1">
        <div data-testid="name">{name}</div>
        <CheckBox
            label="Later"
            dataTestId="later"
            checked={later}
        />
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