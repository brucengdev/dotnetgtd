import { useState } from "react";
import { IClient } from "./api/Client";
import { Button, ButtonMode } from "./controls/Button";
import { TextBox } from "./controls/TextBox";
import { CheckBox } from "./controls/CheckBox";

interface AddProjectFormProps {
    onCancel?: () => any
    onCompleted?: () => any
    client: IClient
}

export default function AddProjectForm(props: AddProjectFormProps) {
    const { onCancel, client, onCompleted } = props
    const [ name, setName ] = useState('')
    const [ later, setLater ] = useState(false)
    return <div data-testid="add-project-form" className="mb-5">
        <h1 className="text-2xl">
            New project
        </h1>
        <TextBox 
            label="Name"
            name="Name"
            value={name}
            className="mb-1"
            onChange={e => setName(e.target.value)}
        />
        <CheckBox
            label="Later"
            checked={later}
            onChange={checked => setLater(checked)}
            dataTestId="addProjectLaterField"
            />
        <CheckBox
            label="Done"
            />
        <div className="flex justify-end gap-2">
            <Button 
                mode={ButtonMode.PRIMARY}
                text="Create"
                onClick={() => {
                    client.AddProject({id: 0, name, later})
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