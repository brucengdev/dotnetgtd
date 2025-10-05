import { useState } from "react"
import { Button } from "./Button"

interface EditableTextViewProps {
    text: string
    textViewTestId?: string
    editViewTestId?: string
}

export function EditableTextView(props: EditableTextViewProps) {
    const { text, textViewTestId, editViewTestId } = props
    const [ isEditing, setIsEditing ] = useState(false)
    const [ editTextValue, setEditTextValue ] = useState(text)
        return isEditing
            ?<>
                <input type="text" data-testId={editViewTestId} 
                    value={editTextValue} 
                    onChange={e => setEditTextValue(e.target.value)}/>
                <Button text="✓" onClick={() => setIsEditing(false)}/>
            </>
            :<div data-testId={textViewTestId} onClick={() => setIsEditing(true)}>
                {text}
            </div>
}