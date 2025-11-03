import { EditableSelect } from "./EditableSelect"
import { describe, expect, it, vitest } from "vitest"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { sleep } from "../__test__/testutils";

describe("EditableSelect", () => {
    it(`Show display view initially`, () => {
        render(<EditableSelect 
            textViewDataTestId="displayField" 
            selectDataTestId="editField" 
            options={[
                { value: "1", text: "Option 1" },
                { value: "2", text: "Option 2" },
                { value: "3", text: "Option 3" }
            ]}
            selectedValue="1"    
        />)

        expect(screen.getByTestId("displayField")).toBeInTheDocument()
        expect(screen.queryByTestId("editField")).not.toBeInTheDocument()
    })

    it(`Shows edit view when display view is clicked`, async () => {
        render(<EditableSelect 
            textViewDataTestId="displayField" 
            selectDataTestId="editField" 
            options={[
                { value: "1", text: "Option 1" },
                { value: "2", text: "Option 2" },
                { value: "3", text: "Option 3" }
            ]}
            selectedValue="1"
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

        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    })

    it("Executes callback when value is changed", async () => {
        var fn = vitest.fn()
        render(<EditableSelect 
            textViewDataTestId="displayField" 
            selectDataTestId="editField" 
            onChange={fn} 
            options={[
                { value: "1", text: "Option 1" },
                { value: "2", text: "Option 2" },
                { value: "3", text: "Option 3" }
            ]}
            selectedValue="1"
        />)

        screen.getByTestId("displayField").click()
        await sleep(1)

        fireEvent.change(screen.getByTestId("editField"), { target: { value: 2 } })
        await sleep(1)

        expect(fn).toHaveBeenCalledWith("2")
        expect(screen.queryByTestId("editField")).not.toBeInTheDocument()
        expect(screen.getByTestId("displayField")).toBeInTheDocument()
    })
})