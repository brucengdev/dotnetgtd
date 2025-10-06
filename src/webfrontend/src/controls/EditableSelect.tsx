
interface EditableSelectProps {
    value?: string
    displayViewDataTestId: string
    editViewDataTestId: string
}

export function EditableSelect(props: EditableSelectProps) {
    const { value, displayViewDataTestId, editViewDataTestId } = props
    return <>
        <div data-testId={displayViewDataTestId}>{value??""}</div>
        <select data-testId={editViewDataTestId}></select>
    </>
}