
interface CheckBoxProps {
    label: string,
    checked: boolean,
    onChange?: (checked: boolean) => void,
    dataTestId?: string
}

export function CheckBox(props: CheckBoxProps) {
    const { label, checked, onChange, dataTestId } = props
    return <label>
        {label}
        <input 
            data-testId={dataTestId}
            type="checkbox" 
            checked={checked} 
            onChange={_ => {
                if(onChange) {
                    onChange(!checked)
                }
            }}
        />
    </label>
}