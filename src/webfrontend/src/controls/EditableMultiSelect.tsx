import { useState } from "react";
import { MultiSelect, MultiSelectProps } from "./MultiSelect";

interface EditableMultiSelectProps extends MultiSelectProps {
    textViewDataTestId?: string
}

export function EditableMultiSelect(props: EditableMultiSelectProps) {
    const { selectedValues, textViewDataTestId, options, selectDataTestId } = props
    const [ isEditing, setIsEditing ] = useState(false)
    return isEditing
            ?<MultiSelect options={options} selectedValues={[]} selectDataTestId={selectDataTestId} />
            :<div data-testId={textViewDataTestId} 
                onClick={() => setIsEditing(true)} >
                {selectedValues.join(",") ?? ""}
            </div>
}