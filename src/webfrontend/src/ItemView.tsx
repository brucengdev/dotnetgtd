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
    const project = props.projects.find(p => p.id === item.projectId)
    const projectName = project?.name
    return <div data-testId="item" className="p-3 border border-gray-800 rounded-md mb-2">
        <div  className="grid grid-cols-7 mb-1 gap-2">
            <EditableTextView 
                className="col-span-6 sm:col-span-1"
                text={description} 
                textViewTestId="description" editViewTestId="edit-description"
                onChange={newDescription => onChange?.({ 
                    ...item, description: newDescription
                }) } 
            />
            <EditableSelect
                className="col-span-6 sm:col-span-1"
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
                className="col-span-6 sm:col-span-1"
                selectedValues={item.tagIds?.map(t => t.toString()) ?? []}
                textViewDataTestId="tags"
                selectDataTestId="edit-tags"
                options={props.tags.map(t => ({ value: t.id.toString(), text: t.name }))}
                onChange={newValues => {
                    const newTagIds = newValues?.map(v => parseInt(v)) ?? []
                    return onChange?.({...item, 
                        tagIds: newTagIds
                    })
                }}
            />
            <CheckBox
                className="col-span-3 sm:col-span-1"
                label="Done"
                checked={project?.done? true: done}
                disabled={project?.done ?? false}
                dataTestId="done"
                onChange={checked => onChange?.({...item, done: checked})}
            />
            <CheckBox
                className="col-span-3 sm:col-span-1"
                label="Later"
                checked={project == null? later: project?.later}
                dataTestId="later"
                onChange={checked => onChange?.({...item, later: checked})}
            />
            <div className="sm:col-span-2 text-right">
                {showConfirmDelete
                    ? <></>
                    : <Button text="Delete" className="pr-2"
                        mode={ButtonMode.DANGER} 
                        onClick={() => setShowConfirmDelete(true)} />}
            </div>
        </div>
            {showConfirmDelete
                ?<ConfirmDeleteView onNo={() => setShowConfirmDelete(false)} 
                    onYes={onDelete} />
                : <></>}
        </div>
}