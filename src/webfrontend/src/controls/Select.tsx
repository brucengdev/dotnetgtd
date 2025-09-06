
interface Option {
    value: string
    text: string
}
interface SelectProps {
    label: string
    onChange?: (value: string) => void
    options: Option[]
    selectedValue: string
}
export function Select(props: SelectProps) {
    const { label, onChange, options, selectedValue } = props
    return <label>
        {label}
        <select onChange={(e) => {
            if(onChange) {
                onChange(e.target.value)
            }
        }}>
            {options?.map(o => <option value={o.value} 
                    selected={o.value === selectedValue}>{o.text}</option>)}
        </select>
    </label>
}