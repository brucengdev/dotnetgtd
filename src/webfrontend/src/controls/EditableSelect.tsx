import { useState } from "react"
import { Select } from "./Select"

interface EditableSelectProps {
    value?: string
    displayViewDataTestId?: string
    editViewDataTestId?: string
}

export function EditableSelect(props: EditableSelectProps) {
    const { value, displayViewDataTestId, editViewDataTestId } = props
    const [isEditing, setIsEditing] = useState(false)
    return <>
        {isEditing
            ? <Select dataTestId={editViewDataTestId} options={[]} selectedValue="" />
            :<div data-testId={displayViewDataTestId} 
                onClick={() => setIsEditing(true)}>
                {value??""}
            </div>}
    </>
}