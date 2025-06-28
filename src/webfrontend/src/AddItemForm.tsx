import { Button, ButtonMode } from "./controls/Button";
import { TextBox } from "./controls/TextBox";

export function AddItemForm() {
    return <div data-testid="add-item-form">
        <h1>
            New item
        </h1>
        <TextBox 
            label="Description"
            name="Description"
            value=""
        />
        <Button 
            mode={ButtonMode.PRIMARY}
            text="Create"
        />
        <Button 
            mode={ButtonMode.SECONDARY}
            text="Cancel"
        />
    </div>
}