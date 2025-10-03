import { useState } from "react"
import { TextBox } from "./TextBox"

interface EditableTextViewProps {
    dataTestId?: string
    text: string
}

export function EditableTextView(props: EditableTextViewProps) {
    const { dataTestId, text } = props
    const [ isEditView, setIsEditView ] = useState(false)
    return isEditView
            ? <TextBox name="description" label="Description" value={text} />
            : <div data-testId={dataTestId} onClick={() => setIsEditView(true)}>{text}</div>
}