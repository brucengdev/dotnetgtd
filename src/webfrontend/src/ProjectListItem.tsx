import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button, ButtonMode } from "./controls/Button"
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
    return <div data-testid="project"  className="grid grid-cols-6 mb-1 border border-gray-800 p-3 rounded-md mt-5">
        <EditableTextView 
            className="col-span-4 md:col-span-3"
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
            onChange={newValue => {
                if(onChange) {
                    onChange({
                        ...project,
                        done: newValue
                    })
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