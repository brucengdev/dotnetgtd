import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { ProjectView } from "./ProjectView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import { Project } from "./models/Project";

describe("ProjectView", () => {
    it("has necessary ui components", () => {
        render(<ProjectView client={new TestClient()} />)

        expect(screen.getByTestId("project-filters")).toBeInTheDocument()
        expect(screen.getByTestId("project-list")).toBeInTheDocument()
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        expect(addItemButton).toBeInTheDocument()
    })

    const cases = [
        {
            name: "0 project",
            expectedProjects: [] as Project[]
        },
        {
            name: "2 projects",
            expectedProjects: [
                { id: 1, name: "Project 1" },
                { id: 2, name: "Project 2" }
            ] as Project[]
        },
        {
            name: "3 projects",
            expectedProjects: [
                { id: 1, name: "Project A" },
                { id: 2, name: "Project B" },
                { id: 3, name: "Project C" }
            ] as Project[]
        }
    ]
    cases.forEach(({ name, expectedProjects}) => {
        it(`shows a list of projects for ${name}`, async () => {
            const client = new TestClient()
            client.Projects = expectedProjects
            render(<ProjectView client={client} />)
            await sleep(1)

            expect(screen.getByTestId("project-list")).toBeInTheDocument()
            
            const projects = screen.queryAllByTestId("project")
            expect(projects.length).toBe(expectedProjects.length)

            for(let i = 0; i < expectedProjects.length; i++) {
                expect(projects[i].querySelector('[data-testid="name"]')?.textContent).toBe(expectedProjects[i].name)
            }
        })
    })

    it("shows add project form when button Add is clicked", () => {
        render(<ProjectView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        expect(screen.getByTestId("add-project-form")).toBeInTheDocument()

        expect(addItemButton).not.toBeInTheDocument()

    })

    it("hides add project form when Cancel button is clicked", async () => {
        render(<ProjectView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        expect(screen.getByTestId("add-project-form")).toBeInTheDocument()
        expect(addItemButton).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", { name: "Cancel"}))

        expect(screen.queryByTestId("add-project-form")).not.toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Add"})).toBeInTheDocument()
    })

    it("hides add project form when Create button is clicked", async () => {
        render(<ProjectView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        fireEvent.change(screen.getByRole("textbox", { name: "Name"}), { target: { value: "New Project 1" } })
        fireEvent.click(screen.getByRole("button", { name: "Create"}))

        await sleep(10)

        expect(screen.queryByTestId("add-project-form")).not.toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Add"})).toBeInTheDocument()
    })

    const testCases = [
        {
            newProjectName: "Project Y",
            later: true
        },
        {
            newProjectName: "Project Z",
            later: false
        }
    ]
    testCases.forEach(testCase => {
        const { newProjectName, later } = testCase
        it("adds a new project when Create button is clicked", async () => {
            const client = new TestClient()
            client.Projects = [
                {id: 1, name: "Project X", later: false, done: false }
            ]
            render(<ProjectView client={client} />)

            await sleep(1)

            let projects = screen.queryAllByTestId("project")
            expect(projects.length).toBe(1)
            expect(projects[0].querySelector('[data-testid="name"]')?.textContent).toBe("Project X")
            
            const addItemButton = screen.getByRole("button", { name: "Add"})
            fireEvent.click(addItemButton)

            fireEvent.change(screen.getByRole("textbox", { name: "Name"}), { target: { value: newProjectName } })
            if(later) {
                fireEvent.click(screen.getByTestId("addProjectLaterField"))
            }
            fireEvent.click(screen.getByRole("button", { name: "Create"}))

            await sleep(1)

            projects = screen.queryAllByTestId("project")
            expect(projects.length).toBe(2)

            expect(projects[0].querySelector('[data-testid="name"]')?.textContent).toBe("Project X")
            expect(projects[1].querySelector('[data-testid="name"]')?.textContent).toBe(newProjectName)
            if(later) {
                expect(projects[1].querySelector('[data-testid="later"]')).toBeChecked()
            }else {
                expect(projects[1].querySelector('[data-testid="later"]')).not.toBeChecked()
            }
        })
    })

    it("deletes a project when delete is clicked and confirmed", async () => {
        const client = new TestClient()
        client.Projects = [
            {id: 1, name: "Project X", later: false, done: false },
            {id: 2, name: "Project Y", later: false, done: false },
            {id: 3, name: "Project Z", later: false, done: false }
        ]
        render(<ProjectView client={client} />)

        await sleep(1)

        const deleteProjectButtons = screen.getAllByRole("button", {name: "Delete"})
        const projectYDeleteButton = deleteProjectButtons[1]
        fireEvent.click(projectYDeleteButton)

        fireEvent.click(screen.getByRole("button", {name: "Yes"}))

        await sleep(1)

        const projects = screen.getAllByTestId("project")
        expect(projects.length).toBe(2)

        expect(projects[0].querySelector('[data-testid="name"]')?.textContent).toBe("Project X")
        expect(projects[1].querySelector('[data-testid="name"]')?.textContent).toBe("Project Z")
    })
})