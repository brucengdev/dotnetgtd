import { useState } from "react";
import { IClient } from "./api/Client";
import { Button, ButtonMode } from "./controls/Button";
import { TextBox } from "./controls/TextBox";
import { Project } from "./models/Project";
import { Tag } from "./models/Tag";
import { CheckBox } from "./controls/CheckBox";
import { Select } from "./controls/Select";

interface AddItemFormProps {
    onCancel: () => any
    onCompleted?: () => any
    client: IClient
}

export function AddItemForm(props: AddItemFormProps) {
    const { onCancel, client, onCompleted } = props
    const [ description, setDescription ] = useState('')
    const [projects, setProjects] = useState<Project[] | undefined>(undefined)
    const [projectId, setProjectId] = useState<number>(0)
    const [tags, setTags] = useState<Tag[] | undefined>(undefined)
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
    const [done, setDone] = useState(false)
    const [later, setLater] = useState(false)
    if(projects === undefined) {
        client.GetProjects()
        .then(retrievedProjects => setProjects(retrievedProjects))
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
        <Select
            label="Project"
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
        <label>
            Tags
            <select multiple onChange={e => {
                const options = e.target.options
                const tagIds = []
                for(let i = 0; i < options.length; i++) {
                    if(options[i].selected) {
                        tagIds.push(Number(options[i].value))
                    }
                }
                setSelectedTagIds(tagIds)
            }}>
                {tags?.map(t => <option 
                    value={t.id} 
                    selected={selectedTagIds.includes(t.id)}
                >{t.name}</option>)}
            </select>
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