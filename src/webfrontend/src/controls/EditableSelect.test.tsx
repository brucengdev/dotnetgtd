import { EditableSelect } from "./EditableSelect"
import { describe, expect, it } from "vitest"
import { screen, render } from "@testing-library/react";
import '@testing-library/jest-dom'
import { sleep } from "../__test__/testutils";

describe("EditableSelect", () => {
    it(`Show display view initially`, () => {
        render(<EditableSelect 
            displayViewDataTestId="displayField" 
            editViewDataTestId="editField" />)

        expect(screen.getByTestId("displayField")).toBeInTheDocument()
        expect(screen.queryByTestId("editField")).not.toBeInTheDocument()
    })

    it(`Shows edit view when display view is clicked`, async () => {
        render(<EditableSelect 
            displayViewDataTestId="displayField" 
            editViewDataTestId="editField" />)

        screen.getByTestId("displayField").click()
        await sleep(1)

        expect(screen.getByTestId("editField")).toBeInTheDocument()
        expect(screen.queryByTestId("displayField")).not.toBeInTheDocument()
    })
})