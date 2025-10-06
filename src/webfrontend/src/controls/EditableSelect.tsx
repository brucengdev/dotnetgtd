import { useState } from "react"

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
            ?<select data-testId={editViewDataTestId}></select>
            :<div data-testId={displayViewDataTestId} 
                onClick={() => setIsEditing(true)}>
                {value??""}
            </div>}
    </>
}