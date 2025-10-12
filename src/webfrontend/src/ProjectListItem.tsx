import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button } from "./controls/Button"
import { CheckBox } from "./controls/CheckBox"
import { EditableTextView } from "./controls/EditableTextView"
import { Project } from "./models/Project"

interface ProjectListItemProps {
    name: string,
    onDelete?: () => void
    later: boolean
    done: boolean
    onChange?: (project: Project) => void
}
export function ProjectListItem(props: ProjectListItemProps) {
    const { name, later, done, onDelete, onChange } = props
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    return <div data-testid="project"  className="grid grid-cols-4 mb-1">
        <EditableTextView 
            text={name} 
            editViewTestId="edit-name"
            textViewTestId="name" 
            onChange={newName => {
                if(onChange) {
                    onChange({
                        id: 0,
                        name: newName,
                        later,
                        done,
                    })
                }
            }}
        />
        <CheckBox
            label="Later"
            dataTestId="later"
            checked={later}
        />
        <CheckBox
            label="Done"
            dataTestId="done"
            checked={done}
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