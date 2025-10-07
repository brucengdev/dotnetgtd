import { MultiSelectProps } from "./MultiSelect";

interface EditableMultiSelectProps extends MultiSelectProps {
    textViewDataTestId?: string
}

export function EditableMultiSelect(props: EditableMultiSelectProps) {
    const { selectedValues, textViewDataTestId } = props
    return <div data-testId={textViewDataTestId} >{selectedValues.join(",") ?? ""}</div>
}