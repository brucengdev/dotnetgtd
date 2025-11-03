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
            ? <>
                <Select selectDataTestId={selectDataTestId} 
                    className={className}
                    options={options} 
                    selectedValue={selectedValue} 
                    onChange={newValue => {
                        setIsEditing(false)
                        if(onChange) {
                            onChange(newValue)
                        }
                    }}
                />
                <Button text="Cancel" mode={ButtonMode.SECONDARY} />
            </>
            :<div data-testId={displayViewDataTestId} 
                    className={className}
                onClick={() => setIsEditing(true)}>
                {optionDisplayText??""}
            </div>
        }
    </>
}