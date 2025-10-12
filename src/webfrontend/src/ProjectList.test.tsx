import { describe, expect, it, vitest } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { ProjectList } from "./ProjectList";
import { sleep } from "./__test__/testutils";

describe("ProjectList", () => {
    it("shows the list of projects", () => {
        const projects = [
            { id: 1, name: "Project A", later: true, done: false },
            { id: 2, name: "Project B", later: false, done: false }
        ]
        render(<ProjectList projects={projects} />)
        
        const projectItems = screen.getAllByTestId("project")
        expect(projectItems.length).toBe(2)

        const projectA = projectItems[0]
        expect(projectA.querySelector("[data-testId='name']")?.textContent)
            .toBe('Project A')
        expect(projectA.querySelector("[data-testId='later']")).toBeChecked()

        const projectB = projectItems[1]
        expect(projectB.querySelector("[data-testId='name']")?.textContent)
            .toBe('Project B')
        expect(projectB.querySelector("[data-testId='later']")).not.toBeChecked()
    })

    it("calls onDelete when a project is deleted", () => {
        const projects = [
            { id: 1, name: "Project A", later: true, done: false },
            { id: 2, name: "Project B", later: false, done: false }
        ]
        const onDelete = vitest.fn()
        render(<ProjectList projects={projects} onDelete={onDelete} />)

        const deleteProjectButtons = screen.getAllByRole("button", {name: "Delete"})
        const projectYDeleteButton = deleteProjectButtons[1]
        fireEvent.click(projectYDeleteButton)
        
        fireEvent.click(screen.getByRole("button", {name: "Yes"}))
        expect(onDelete).toHaveBeenCalledWith(2)
    })

    it("calls onChange when a project is changed", async () => {
        const projects = [
            { id: 1, name: "Project A", later: true, done: false },
            { id: 2, name: "Project B", later: false, done: false }
        ]
        const onChange = vitest.fn()
        render(<ProjectList projects={projects} onChange={onChange} />)

        const projectItems = screen.getAllByTestId("name")
        projectItems[1].click() //click project B's name to edit
        await sleep(1)

        fireEvent.change(screen.getByTestId("edit-name"), { target: { value: "Project B Updated" } })
        fireEvent.click(screen.getByRole("button", { name: "✓" }))
        
        expect(onChange).toHaveBeenCalledWith({ 
            id: 2,
            name: "Project B Updated", 
            later: false,
            done: false 
        })
    })
});