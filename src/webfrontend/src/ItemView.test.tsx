import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'

describe("ItemView", () => {
    it("renders description and delete button", () => {
        render(<ItemView description="Test Description" projectName="Project A" />)

        const description = screen.getByTestId("description")
        expect(description).toBeInTheDocument()
        expect(description.textContent).toBe("Test Description")
        
        const projectName = screen.getByTestId("project")
        expect(projectName).toBeInTheDocument()
        expect(projectName.textContent).toBe("Project A")

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        expect(deleteButton).toBeInTheDocument()

        expect(screen.queryByTestId("confirmDeleteView")).not.toBeInTheDocument()
    })

    it("shows delete confirm view when delete is clicked", () => {
        render(<ItemView description="Test Description" />)

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton)

        expect(screen.getByTestId("confirmDeleteView")).toBeInTheDocument()
        expect(deleteButton).not.toBeInTheDocument()
    })

    it("hides delete confirm view when no is clicked", () => {
        render(<ItemView description="Test Description" />)

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton)

        fireEvent.click(screen.getByRole("button", { name: "No" }))
        expect(screen.queryByTestId("confirmDeleteView")).not.toBeInTheDocument()
    })

    it("executes onDelete when yes is clicked", () => {
        const onDelete = vitest.fn()
        render(<ItemView description="Test Description" onDelete={onDelete} />)

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton)

        fireEvent.click(screen.getByRole("button", { name: "Yes" }))
        expect(onDelete).toHaveBeenCalled()
    })
})