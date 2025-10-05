import { describe, expect, it } from "vitest"
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

        const input = screen.getByTestId("edit-description")
        expect(input).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "✓"})).toBeInTheDocument()
        expect(screen.queryByTestId("description")).not.toBeInTheDocument()

        expect(input).toHaveValue("Task A")
    })

    it("changes description back to text view after clicking accept", () => {
        render(<ItemView description="Task A" 
            projectName="ProjectX" tagNames={["tag1", "tag2"]}
            done={false} later={false} />)

        const descriptionView = screen.getByTestId("description")
        fireEvent.click(descriptionView)

        fireEvent.click(screen.getByRole("button", { name: "✓"}))

        expect(screen.queryByTestId("edit-description")).not.toBeInTheDocument()
        expect(screen.getByTestId("description")).toBeInTheDocument()
    })
})