import { useState } from "react"
import { Select, SelectProps } from "./Select"
import { Button, ButtonMode } from "./Button"

interface EditableSelectProps extends SelectProps {
    textViewDataTestId?: string
    className?: string
}

export function EditableSelect(props: EditableSelectProps) {
    const { textViewDataTestId: displayViewDataTestId, 
        selectDataTestId, options, onChange, selectedValue, className } = props
    const [isEditing, setIsEditing] = useState(false)
    const optionDisplayText = options.find(o => o.value === (selectedValue??""))?.text
    return <>
        {isEditing
            ? <div className={className}>
                <Select selectDataTestId={selectDataTestId} 
                    className={` block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 ` +
                        `outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600`}
                    options={options} 
                    selectedValue={selectedValue} 
                    onChange={newValue => {
                        setIsEditing(false)
                        if(onChange) {
                            onChange(newValue)
                        }
                    }}
                />
                <Button text="x" mode={ButtonMode.SECONDARY} 
                    onClick={() => setIsEditing(false)}
                />
            </div>
            :<div data-testId={displayViewDataTestId} 
                    className={className}
                onClick={() => setIsEditing(true)}>
                {optionDisplayText??""}
            </div>
        }
    </>
}