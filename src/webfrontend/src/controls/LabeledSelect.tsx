import { Select, SelectProps } from "./Select"

interface LabeledSelectProps extends SelectProps {
    label: string
}
export function LabeledSelect(props: LabeledSelectProps) {
    const { label, onChange, options, selectedValue } = props
    return <label>
        {label}
        <Select onChange={onChange} options={options} selectedValue={selectedValue} />
    </label>
}