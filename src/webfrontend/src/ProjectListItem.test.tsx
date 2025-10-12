import { describe, expect, it, vitest } from "vitest";
import { ProjectListItem } from "./ProjectListItem";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'

describe("ProjectListItem", () => {
    [
        { later: false, done: false },
        { later: false, done: true },
        { later: true, done: false },
        { later: true, done: true }
    ]
    .forEach(({ later, done }) => {
        it("shows project data and delete button", () => {
            render(<ProjectListItem 
                project={{
                    id: 1,
                    name: "Test Project",
                    later,
                    done
                }}
                />)

            expect(screen.getByTestId("name")).toBeInTheDocument()
            expect(screen.getByTestId("name").textContent).toBe("Test Project")
            expect(screen.getByTestId("later")).toBeInTheDocument()
            if(later) {
                expect(screen.getByTestId("later")).toBeChecked()
            } else {
                expect(screen.getByTestId("later")).not.toBeChecked()
            }
            expect(screen.getByTestId("done")).toBeInTheDocument()
            if(done) {
                expect(screen.getByTestId("done")).toBeChecked()
            } else {
                expect(screen.getByTestId("done")).not.toBeChecked()
            }
            expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
        })
    })
    
    it("shows confirms delete form when delete is clicked", () => {
        render(<ProjectListItem project={{ id: 1, name:"Test Project", later:false, done:false}} />)

        expect(screen.queryByTestId("confirmDeleteView")).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", { name: "Delete" }))

        expect(screen.getByTestId("confirmDeleteView")).toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument()
    })

    it("hides confirm delete form when no is clicked", () => {
        render(<ProjectListItem project={{ id: 1, name:"Test Project", later:false, done:false}} />)

        fireEvent.click(screen.getByRole("button", { name: "Delete" }))

        expect(screen.getByTestId("confirmDeleteView")).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", {name: "No"}))
        expect(screen.queryByTestId("confirmDeleteView")).not.toBeInTheDocument()
    })

    it("must calls onDelete when yes is clicked", () => {
        const onDelete = vitest.fn()
        render(<ProjectListItem project={{ id: 1, name:"Test Project", later:false, done:false}} 
            onDelete={onDelete} />)

        fireEvent.click(screen.getByRole("button", { name: "Delete" }))

        expect(screen.getByTestId("confirmDeleteView")).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", {name: "Yes"}))
        expect(onDelete).toHaveBeenCalled()
    })
});