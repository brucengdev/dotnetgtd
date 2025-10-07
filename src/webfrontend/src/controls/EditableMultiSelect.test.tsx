import { describe, expect, it } from "vitest"
import { screen, render } from "@testing-library/react";
import '@testing-library/jest-dom'
import { EditableMultiSelect } from "./EditableMultiSelect";
import { sleep } from "../__test__/testutils";

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

    it(`shows edit view when display view is clicked`, async () => {
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

        screen.getByTestId("displayField").click()
        await sleep(1)

        expect(screen.getByTestId("editField")).toBeInTheDocument()
        expect(screen.queryByTestId("displayField")).not.toBeInTheDocument()

        expect(screen.getByTestId("editField").children.length).toBe(3)
        expect(screen.getByTestId("editField").children[0].textContent).toBe("Option 1")
        expect(screen.getByTestId("editField").children[0]).toHaveAttribute("value", "1")
        expect(screen.getByTestId("editField").children[1].textContent).toBe("Option 2")
        expect(screen.getByTestId("editField").children[1]).toHaveAttribute("value", "2")
        expect(screen.getByTestId("editField").children[2].textContent).toBe("Option 3")
        expect(screen.getByTestId("editField").children[2]).toHaveAttribute("value", "3")
    })
})