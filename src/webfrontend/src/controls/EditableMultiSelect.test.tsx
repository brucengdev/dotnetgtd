import { describe, expect, it } from "vitest"
import { screen, render } from "@testing-library/react";
import '@testing-library/jest-dom'
import { EditableMultiSelect } from "./EditableMultiSelect";

describe("EditableMultiSelect", () => {
    it(`shows display view initially`, () => {
        render(<EditableMultiSelect 
            textViewDataTestId="displayField" 
            selectDataTestId="editField" 
            options={[
                { value: "1", text: "Option 1" },
                { value: "2", text: "Option 2" },
                { value: "3", text: "Option 3" }
            ]}
            selectedValues={["1"]}
        />)

        expect(screen.getByTestId("displayField")).toBeInTheDocument()
        expect(screen.queryByTestId("editField")).not.toBeInTheDocument()
    })
})