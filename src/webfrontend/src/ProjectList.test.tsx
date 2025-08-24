import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { ProjectList } from "./ProjectList";

describe("ProjectList", () => {
    it("shows the list of projects", () => {
        const projects = [
            { id: 1, name: "Project A" },
            { id: 2, name: "Project B" }
        ]
        render(<ProjectList projects={projects} />)
        
        const projectItems = screen.getAllByTestId("project")
        expect(projectItems.length).toBe(2)

        const projectA = projectItems[0]
        expect(projectA.querySelector("[data-testId='name']")?.textContent)
            .toBe('Project A')

        const projectB = projectItems[0]
        expect(projectB.querySelector("[data-testId='name']")?.textContent)
            .toBe('Project B')
    })

    it("calls onDelete when a project is deleted", () => {
        const projects = [
            { id: 1, name: "Project A" },
            { id: 2, name: "Project B" }
        ]
        render(<ProjectList projects={projects} />)
    })
});