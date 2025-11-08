interface Option {
    value: string
    text: string
}
export interface SelectProps {
    onChange?: (value: string) => void
    options: Option[]
    selectedValue: string
    selectDataTestId?: string
    className?: string
}
export function Select(props: SelectProps) {
    const { onChange, options, selectedValue, selectDataTestId: dataTestId, className } = props
    return <select 
        className={`${className} block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 " +
                        "outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 " +`}
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