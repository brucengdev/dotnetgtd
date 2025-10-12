import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button } from "./controls/Button"
import { CheckBox } from "./controls/CheckBox"
import { EditableTextView } from "./controls/EditableTextView"
import { Project } from "./models/Project"

interface ProjectListItemProps {
    project: Project,
    onDelete?: () => void
    onChange?: (project: Project) => void
}
export function ProjectListItem(props: ProjectListItemProps) {
    const { onDelete, onChange, project } = props
    const { name, later, done } = project
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    return <div data-testid="project"  className="grid grid-cols-4 mb-1">
        <EditableTextView 
            text={name} 
            editViewTestId="edit-name"
            textViewTestId="name" 
            onChange={newName => {
                if(onChange) {
                    onChange({
                        ...project,
                        name: newName
                    })
                }
            }}
        />
        <CheckBox
            label="Later"
            dataTestId="later"
            checked={later}
            onChange={newValue => {
                if(onChange) {
                    onChange({
                        ...project,
                        later: newValue
                    })
                }
            }}
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