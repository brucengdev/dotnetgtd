import { useState } from "react";
import { MultiSelect, MultiSelectProps } from "./MultiSelect";
import { Button } from "./Button";

interface EditableMultiSelectProps extends MultiSelectProps {
    textViewDataTestId?: string
    className?: string
}

export function EditableMultiSelect(props: EditableMultiSelectProps) {
    const { selectedValues, textViewDataTestId, 
        options, selectDataTestId, onChange, className } = props
    const [ isEditing, setIsEditing ] = useState(false)
    const [ editFieldSelectedValues, setEditFieldSelectedValues ] = useState(selectedValues)
    const displayValue = selectedValues?.map(v => {
        return options.find(o => o.value === v)?.text ?? v
    }).join(',') ?? ""
    return isEditing
            ?<div className={className}>
                <MultiSelect 
                    options={options} 
                    selectedValues={editFieldSelectedValues} 
                    selectDataTestId={selectDataTestId} 
                    onChange={newValues =>  {
                        setEditFieldSelectedValues(newValues)}
                    }
                />
                <Button text="✓" onClick={() => {
                    if(onChange) {
                        onChange(editFieldSelectedValues)
                    }
                }} />
            </div>
            :<div data-testId={textViewDataTestId} 
                className={className}
                onClick={() => setIsEditing(true)} >
                {displayValue}
            </div>
}