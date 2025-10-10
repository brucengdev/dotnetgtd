import { useState } from "react"
import { Select, SelectProps } from "./Select"

interface EditableSelectProps extends SelectProps {
    value?: string
    textViewDataTestId?: string
}

export function EditableSelect(props: EditableSelectProps) {
    const { value, textViewDataTestId: displayViewDataTestId, selectDataTestId, options, onChange, selectedValue } = props
    const [isEditing, setIsEditing] = useState(false)
    return <>
        {isEditing
            ? <Select selectDataTestId={selectDataTestId} 
                    options={options} 
                    selectedValue={selectedValue} 
                    onChange={newValue => {
                        setIsEditing(false)
                        if(onChange) {
                            onChange(newValue)
                        }
                    }}
                />
            :<div data-testId={displayViewDataTestId} 
                onClick={() => setIsEditing(true)}>
                {value??""}
            </div>
        }
    </>
}