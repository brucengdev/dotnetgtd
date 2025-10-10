import { describe, expect, it, vitest } from "vitest"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { EditableMultiSelect } from "./EditableMultiSelect";
import { sleep } from "../__test__/testutils";
import userEvent from "@testing-library/user-event";

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
        expect(screen.queryByRole("button", { name: "✓" })).not.toBeInTheDocument()
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

        expect(screen.getByRole("button", { name: "✓" })).toBeInTheDocument()
    })

    const selectedValueSets = [[""], ["1"], ["","2"], ["1","2","3"]]
    selectedValueSets.forEach(selectedValues => {
        it(`shows edit view when display view is clicked and ${selectedValues.join(",")} are selected`, async () => {
            render(<EditableMultiSelect 
                textViewDataTestId="displayField" 
                selectDataTestId="editField" 
                options={[
                    { value: "", text: "No options" },
                    { value: "1", text: "Option 1" },
                    { value: "2", text: "Option 2" },
                    { value: "3", text: "Option 3" }
                ]}
                selectedValues={selectedValues}
            />)

            screen.getByTestId("displayField").click()
            await sleep(1)

            expect((screen.getByRole("option", { name: "No options"}) as HTMLOptionElement).selected).toBe(selectedValues.includes(""))
            expect((screen.getByRole("option", { name: "Option 1"}) as HTMLOptionElement).selected).toBe(selectedValues.includes("1"))
            expect((screen.getByRole("option", { name: "Option 2"}) as HTMLOptionElement).selected).toBe(selectedValues.includes("2"))
            expect((screen.getByRole("option", { name: "Option 3"}) as HTMLOptionElement).selected).toBe(selectedValues.includes("3"))
        })
    })

    selectedValueSets.forEach(selectedValues => {
        it(`execute callbacks when display view is clicked and ${selectedValues.join(",")} are selected and accept is clicked`, async () => {
            const fn = vitest.fn()
            render(<EditableMultiSelect 
                textViewDataTestId="displayField" 
                selectDataTestId="editField" 
                options={[
                    { value: "", text: "No options" },
                    { value: "1", text: "Option 1" },
                    { value: "2", text: "Option 2" },
                    { value: "3", text: "Option 3" }
                ]}
                selectedValues={[]}
                onChange={fn}
            />)

            screen.getByTestId("displayField").click()
            await sleep(1)
            
            userEvent.selectOptions(screen.getByTestId("editField"), selectedValues)
            await sleep(10)

            const option1 = screen.getByRole("option", { name: "No options"}) as HTMLOptionElement
            const option2 = screen.getByRole("option", { name: "Option 1"}) as HTMLOptionElement
            const option3 = screen.getByRole("option", { name: "Option 2"}) as HTMLOptionElement
            const option4 = screen.getByRole("option", { name: "Option 3"}) as HTMLOptionElement
            expect(option1.selected).toBe(selectedValues.includes(""))
            expect(option2.selected).toBe(selectedValues.includes("1"))
            expect(option3.selected).toBe(selectedValues.includes("2"))
            expect(option4.selected).toBe(selectedValues.includes("3"))

            fireEvent.click(screen.getByRole("button", { name: "✓" }))

            await sleep(1)

            
            expect(fn).toHaveBeenCalledWith(selectedValues)
        })
    })
})