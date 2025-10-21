
interface CheckBoxProps {
    label: string,
    checked: boolean,
    onChange?: (checked: boolean) => void,
    dataTestId?: string
}

export function CheckBox(props: CheckBoxProps) {
    const { label, checked, onChange, dataTestId } = props
    return <label className="mr-4 block">
        <input 
            className="ml-1"
            data-testId={dataTestId}
            type="checkbox" 
            checked={checked} 
            onClick={_ => {
                if(onChange) {
                    onChange(!checked)
                }
            }}
        />
        {label}
    </label>
}