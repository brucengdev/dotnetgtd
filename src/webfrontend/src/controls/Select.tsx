interface Option {
    value: string
    text: string
}
export interface SelectProps {
    onChange?: (value: string) => void
    options: Option[]
    selectedValue: string
    dataTestId?: string
}
export function Select(props: SelectProps) {
    const { onChange, options, selectedValue, dataTestId } = props
    return <select 
        data-testId={dataTestId}
        onChange={(e) => {
            if(onChange) {
                onChange(e.target.value)
            }
        }}>
            {options?.map(o => <option value={o.value} 
                    selected={o.value === selectedValue}>{o.text}</option>)}
        </select>
}