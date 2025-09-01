import { useState } from "react";
import { IClient } from "./api/Client";
import { Button, ButtonMode } from "./controls/Button";
import { TextBox } from "./controls/TextBox";

interface AddtagFormProps {
    onCancel?: () => any
    onCompleted?: () => any
    client: IClient
}

export default function AddtagForm(props: AddtagFormProps) {
    const { onCancel, client, onCompleted } = props
    const [ name, setName ] = useState('')
    return <div data-testid="add-tag-form" className="mb-5">
        <h1 className="text-2xl">
            New tag
        </h1>
        <TextBox 
            label="Name"
            name="Name"
            value={name}
            className="mb-1"
            onChange={e => setName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
            <Button 
                mode={ButtonMode.PRIMARY}
                text="Create"
                onClick={() => {
                    client.AddTag({id: 0, name: name})
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