import { useState } from "react"
import { Button } from "./Button"

interface EditableTextViewProps {
    text: string
    textViewTestId?: string
    editViewTestId?: string
    onChange?: (newText: string) => void
    className?: string
}

export function EditableTextView(props: EditableTextViewProps) {
    const { text, textViewTestId, editViewTestId, onChange, className } = props
    const [ isEditing, setIsEditing ] = useState(false)
    const [ editTextValue, setEditTextValue ] = useState(text)
        return isEditing
            ?<div className={className??""}>
                <input type="text" data-testId={editViewTestId} 
                    value={editTextValue} 
                    onChange={e => setEditTextValue(e.target.value)}/>
                <Button text="✓" onClick={() => {
                    if(onChange && editTextValue !== text) {
                        onChange(editTextValue)
                    }
                    setIsEditing(false)
                }}/>
            </ div>
            :<div className={className??""}
                data-testId={textViewTestId} 
                onClick={() => setIsEditing(true)}>
                {text}
            </div>
}