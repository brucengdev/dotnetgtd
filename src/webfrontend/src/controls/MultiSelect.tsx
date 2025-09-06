
interface Option {
    value: string
    text: string
}
interface MultiSelectProps {
    label: string
    onChange?: (values: string[]) => void
    options: Option[]
    selectedValues: string[]
}
export function MultiSelect(props: MultiSelectProps) {
    const { label, onChange, options, selectedValues } = props
    return <label>
        {label}
        <select multiple onChange={e => {
            if(onChange) {
                onChange(getSelectedValues(e))
            }
        }}>
            {options.map(t => <option 
                value={t.value} 
                selected={selectedValues.includes(t.value)}
            >{t.text}</option>)}
        </select>
    </label>
}

function getSelectedValues(e: React.ChangeEvent<HTMLSelectElement>) {
    const options = e.target.options
    const values = []
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            values.push(options[i].value)
        }
    }
    return values
}
