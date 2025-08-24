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
    })
});