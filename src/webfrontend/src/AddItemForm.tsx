import { useState } from "react";
import { IClient } from "./api/Client";
import { Button, ButtonMode } from "./controls/Button";
import { TextBox } from "./controls/TextBox";

interface AddItemFormProps {
    onCancel: () => any
    client: IClient
}

export function AddItemForm(props: AddItemFormProps) {
    const { onCancel } = props
    const [ description, setDescription ] = useState('')
    return <div data-testid="add-item-form">
        <h1>
            New item
        </h1>
        <TextBox 
            label="Description"
            name="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
        />
        <Button 
            mode={ButtonMode.PRIMARY}
            text="Create"
        />
        <Button 
            mode={ButtonMode.SECONDARY}
            text="Cancel"
            onClick={onCancel}
        />
    </div>
}