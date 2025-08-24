import { describe, expect, it, vitest } from "vitest";
import { ProjectListItem } from "./ProjectListItem";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'

describe("ProjectListItem", () => {
    it("shows the name and delete button", () => {
        render(<ProjectListItem name="Test Project" />)

        expect(screen.getByTestId("name")).toBeInTheDocument()
        expect(screen.getByTestId("name").textContent).toBe("Test Project")
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
    })
    
    it("shows confirms delete form when delete is clicked", () => {
        render(<ProjectListItem name="Test Project" />)

        expect(screen.queryByTestId("confirmDeleteView")).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", { name: "Delete" }))

        expect(screen.getByTestId("confirmDeleteView")).toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument()
    })

    it("hides confirm delete form when no is clicked", () => {
        render(<ProjectListItem name="Test Project" />)

        fireEvent.click(screen.getByRole("button", { name: "Delete" }))

        expect(screen.getByTestId("confirmDeleteView")).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", {name: "No"}))
        expect(screen.queryByTestId("confirmDeleteView")).not.toBeInTheDocument()
    })

    it("must calls onDelete when yes is clicked", () => {
        const onDelete = vitest.fn()
        render(<ProjectListItem name="Test Project" onDelete={onDelete} />)

        fireEvent.click(screen.getByRole("button", { name: "Delete" }))

        expect(screen.getByTestId("confirmDeleteView")).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", {name: "Yes"}))
        expect(onDelete).toHaveBeenCalled()
    })
});