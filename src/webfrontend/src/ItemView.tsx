import { useState } from "react"
import { ConfirmDeleteView } from "./ConfirmDeleteView"
import { Button, ButtonMode } from "./controls/Button"
import { CheckBox } from "./controls/CheckBox"
import { EditableTextView } from "./controls/EditableTextView"
import { Item } from "./models/Item"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"
import { EditableSelect } from "./controls/EditableSelect"
import { EditableMultiSelect } from "./controls/EditableMultiSelect"

interface ItemViewProps {
    onChange?: (item: Item) => void
    onDelete?: () => void
    item: Item
    projects: Project[]
    tags: Tag[]
}
export default function ItemView(props: ItemViewProps) {
    const { item, onChange, onDelete, projects } = props
    const { description, done, later } = item
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false)
    const projectName = props.projects.find(p => p.id === item.projectId)?.name
    const tagNames = (props.tags??[])
                    .filter(t => item.tagIds?.includes(t.id))
                    .map(t => t.name)
    return <div data-testId="item">
        <div  className="grid grid-cols-6 mb-1">
            <EditableTextView 
                text={description} 
                textViewTestId="description" editViewTestId="edit-description"
                onChange={newDescription => onChange?.({ 
                    ...item, description: newDescription
                }) } 
            />
            <EditableSelect
                value={projectName}
                textViewDataTestId="project"
                selectDataTestId="edit-project"
                options={
                    [{ value: "", text: "No project" }] .concat(
                        projects.map(p => ({ value: p.id.toString(), text: p.name }))
                    )
                }
                selectedValue={item.projectId?.toString() ?? ""}
                onChange={newProjectId => onChange?.({...item, projectId: newProjectId ? parseInt(newProjectId) : undefined})}
            />
            <EditableMultiSelect 
                selectedValues={tagNames}
                textViewDataTestId="tags"
                selectDataTestId="edit-tags"
                options={[]} />
            <CheckBox
                label="Done"
                checked={done}
                dataTestId="done"
                onChange={checked => onChange?.({...item, done: checked})}
            />
            <CheckBox
                label="Later"
                checked={later}
                dataTestId="later"
                onChange={checked => onChange?.({...item, later: checked})}
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