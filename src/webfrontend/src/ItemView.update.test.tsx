import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'

describe("ItemView update form", () => {
    it("changes to textbox to edit description when clicked on", () => {
        render(<ItemView description="Task A" 
            projectName="ProjectX" tagNames={["tag1", "tag2"]}
            done={false} later={false} />)

        const descriptionView = screen.getByTestId("description")
        fireEvent.click(descriptionView)

        const input = screen.getByRole("textbox", { name: "Description" })
        expect(input).toBeInTheDocument()

        expect(input).toHaveValue("Task A")
    })
})