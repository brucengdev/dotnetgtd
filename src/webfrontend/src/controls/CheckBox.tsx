
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
            onChange={e => {
                if(onChange) {
                    onChange(!checked)
                }
            }}
        />
    </label>
}