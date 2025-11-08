import { useState } from "react";
import { IClient } from "./api/Client";
import { Button, ButtonMode } from "./controls/Button";
import { TextBox } from "./controls/TextBox";
import { Project } from "./models/Project";
import { Tag } from "./models/Tag";
import { CheckBox } from "./controls/CheckBox";
import { MultiSelect } from "./controls/MultiSelect";
import { Select } from "./controls/Select";
import { ProjectFilter } from "./ProjectFilters";

interface InitialValues {
    projectId?: number
}

interface AddItemFormProps {
    onCancel: () => any
    onCompleted?: () => any
    client: IClient
    projectFilter?: ProjectFilter
    initialValues?: InitialValues
}

export function AddItemForm(props: AddItemFormProps) {
    const { onCancel, client, onCompleted, projectFilter, initialValues } = props
    const [ description, setDescription ] = useState('')
    const [projects, setProjects] = useState<Project[] | undefined>(undefined)
    const [projectId, setProjectId] = useState<number>(initialValues?.projectId ?? 0)
    const [tags, setTags] = useState<Tag[] | undefined>(undefined)
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
    const [done, setDone] = useState(false)
    const [later, setLater] = useState(false)
    if(projects === undefined) {
        client.GetProjects(projectFilter)
        .then(retrievedProjects => setProjects(retrievedProjects.sort((a, b) => a.name.localeCompare(b.name))))
    }

    if(tags === undefined) {
        client.GetTags()
        .then(retrievedTags => setTags(retrievedTags))
    }

    return <div data-testid="add-item-form" className="mb-5">
        <h1 className="text-2xl">
            New item
        </h1>
        <TextBox 
            label="Description"
            name="Description"
            value={description}
            className="mb-1"
            onChange={e => setDescription(e.target.value)}
        />
        <label className="block m-2">
            Project
            <Select
                onChange={value => setProjectId(Number(value))} 
                options={
                    [{ text: "[No project]", value: "0"}]
                    .concat(
                    (projects|| []).map(p => {
                    return {
                        value: p.id.toString(),
                        text: p.name
                    }
                }))}
                selectedValue={projectId.toString()}
            />
        </label>
        <label className="block m-2">
            Tags
            <MultiSelect
                onChange={values => setSelectedTagIds(values.map(v => Number(v)))}
                selectedValues={selectedTagIds.map(id => id.toString())}
                options={
                    (tags || []).map(t => {
                        return { value: t.id.toString(), text: t.name }
                    })
                }
            />
        </label>
        <CheckBox
            label="Done"
            checked={done}
            onChange={checked => setDone(checked)}
            dataTestId="addItemDoneField"
        />
        <CheckBox
            label="Later"
            checked={later}
            onChange={checked => setLater(checked)}
            dataTestId="addItemLaterField"
        />
        <div className="flex justify-end gap-2">
            <Button 
                mode={ButtonMode.PRIMARY}
                text="Create"
                onClick={() => {
                    client.AddItem({
                        id: 0, 
                        description, 
                        projectId: (projectId === 0? undefined: projectId),
                        tagIds: selectedTagIds,
                        done,
                        later
                    })
                    .then(() => {
                        if(onCompleted) {
                            onCompleted()
                        }
                    })
                }}
            />
            <Button 
                mode={ButtonMode.SECONDARY}
                text="Cancel"
                onClick={onCancel}
            />
        </div>
    </div>
}