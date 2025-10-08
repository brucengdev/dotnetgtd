import { useState } from "react";
import { MultiSelect, MultiSelectProps } from "./MultiSelect";
import { Button } from "./Button";

interface EditableMultiSelectProps extends MultiSelectProps {
    textViewDataTestId?: string
}

export function EditableMultiSelect(props: EditableMultiSelectProps) {
    const { selectedValues, textViewDataTestId, 
        options, selectDataTestId, onChange } = props
    const [ isEditing, setIsEditing ] = useState(false)
    const [ editFieldSelectedValues, setEditFieldSelectedValues ] = useState(selectedValues)
    return isEditing
            ?<>
                <MultiSelect 
                    options={options} 
                    selectedValues={editFieldSelectedValues} 
                    selectDataTestId={selectDataTestId} 
                    onChange={newValues =>  setEditFieldSelectedValues(newValues)}
                    />
                <Button text="✓" onClick={() => {
                    if(onChange) {
                        onChange(editFieldSelectedValues)
                    }
                }} />
            </>
            :<div data-testId={textViewDataTestId} 
                onClick={() => setIsEditing(true)} >
                {selectedValues.join(",") ?? ""}
            </div>
}