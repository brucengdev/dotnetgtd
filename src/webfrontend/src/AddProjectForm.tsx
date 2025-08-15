import { useState } from "react";
import { IClient } from "./api/Client";
import { Button, ButtonMode } from "./controls/Button";
import { TextBox } from "./controls/TextBox";

interface AddProjectFormProps {
    onCancel?: () => any
    onCompleted?: () => any
    client?: IClient
}

export default function AddProjectForm(props: AddProjectFormProps) {
    const { onCancel, client, onCompleted } = props
    const [ description, setDescription ] = useState('')
    return <div data-testid="add-project-form" className="mb-5">
        <h1 className="text-2xl">
            New project
        </h1>
        <TextBox 
            label="Description"
            name="Description"
            value={description}
            className="mb-1"
            onChange={e => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2">
            <Button 
                mode={ButtonMode.PRIMARY}
                text="Create"
                onClick={() => {
                    client?.AddProject({id: 0, description})
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