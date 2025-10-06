import { useState } from "react"
import { Select, SelectProps } from "./Select"

interface EditableSelectProps extends SelectProps {
    value?: string
    displayViewDataTestId?: string
    editViewDataTestId?: string
}

export function EditableSelect(props: EditableSelectProps) {
    const { value, displayViewDataTestId, editViewDataTestId, options, onChange, selectedValue } = props
    const [isEditing, setIsEditing] = useState(false)
    return <>
        {isEditing
            ? <Select dataTestId={editViewDataTestId} options={options} selectedValue={selectedValue} onChange={onChange} />
            :<div data-testId={displayViewDataTestId} 
                onClick={() => setIsEditing(true)}>
                {value??""}
            </div>}
    </>
}