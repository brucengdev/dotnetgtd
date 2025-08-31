import { useState } from "react";
import { IClient } from "./api/Client";
import { Button, ButtonMode } from "./controls/Button";
import { TextBox } from "./controls/TextBox";
import { Project } from "./models/Project";

interface AddItemFormProps {
    onCancel: () => any
    onCompleted?: () => any
    client: IClient
}

export function AddItemForm(props: AddItemFormProps) {
    const { onCancel, client, onCompleted } = props
    const [ description, setDescription ] = useState('')
    const [projects, setProjects] = useState<Project[] | undefined>(undefined)
    if(projects === undefined) {
        client.GetProjects()
        .then(retrievedProjects => setProjects(retrievedProjects))
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
        <label>
            Project
            <select>
                <option selected>[No project]</option>
                {projects?.map(p => <option>{p.name}</option>)}
            </select>
        </label>
        <div className="flex justify-end gap-2">
            <Button 
                mode={ButtonMode.PRIMARY}
                text="Create"
                onClick={() => {
                    client.AddItem({id: 0, description})
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