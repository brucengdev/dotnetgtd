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
    </div>
}