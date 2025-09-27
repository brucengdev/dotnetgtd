import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TaskView } from "./TaskView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("TaskView", () => {
    it("shows all tasks initially and all project filters are checked", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0, done: false, later: false },
            { id: 2, description: "Task B", projectId: 1, done: false, later: false },
            { id: 3, description: "Task C", projectId: 2, done: false, later: false }
        ]
        client.Projects = [
            { id: 1, name: "Project 1", later: false },
            { id: 2, name: "Project 2", later: false }
        ]
        render(<TaskView client={client} />)

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "All projects"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Project 1"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Project 2"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "No project"})).toBeChecked()

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(3)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task A")
        expect(items[1].querySelector('[data-testId="description"]')?.textContent).toBe("Task B")
        expect(items[2].querySelector('[data-testId="description"]')?.textContent).toBe("Task C")
    })

    it("shows only tasks not from any project", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: undefined,   done: false, later: false },
            { id: 2, description: "Task B", projectId: 1,           done: false, later: false },
            { id: 3, description: "Task C", projectId: 2,           done: false, later: false }
        ]
        client.Projects = [
            { id: 1, name: "Project 1", later: false },
            { id: 2, name: "Project 2", later: false }
        ]
        render(<TaskView client={client} />)
        await sleep(1)
        const noProjectCheckbox = screen.getByRole("checkbox", { name: "No project"})
        expect(noProjectCheckbox).toBeChecked()
        const allProjectCheckbox = screen.getByRole("checkbox", { name: "All projects"})
        expect(allProjectCheckbox).toBeChecked()

        allProjectCheckbox.click()

        await sleep(1)

        expect(allProjectCheckbox).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Project 1"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Project 2"})).not.toBeChecked()
        expect(noProjectCheckbox).toBeChecked()

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(1)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task A")
    })

    it("shows only tasks from at least a project", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: undefined,   done: false, later: false },
            { id: 2, description: "Task B", projectId: 1,           done: false, later: false },
            { id: 3, description: "Task C", projectId: 2,           done: false, later: false }
        ]
        client.Projects = [
            { id: 1, name: "Project 1", later: false },
            { id: 2, name: "Project 2", later: false }
        ]
        render(<TaskView client={client} />)
        await sleep(1)
        const noProjectCheckbox = screen.getByRole("checkbox", { name: "No project"})
        expect(noProjectCheckbox).toBeChecked()
        const allProjectCheckbox = screen.getByRole("checkbox", { name: "All projects"})
        expect(allProjectCheckbox).toBeChecked()

        noProjectCheckbox.click()

        await sleep(1)

        expect(allProjectCheckbox).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Project 1"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Project 2"})).toBeChecked()
        expect(noProjectCheckbox).not.toBeChecked()

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(2)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task B")
        expect(items[1].querySelector('[data-testId="description"]')?.textContent).toBe("Task C")
    })

    it("shows only tasks from selected project", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: undefined,   done: false, later: false },
            { id: 2, description: "Task B", projectId: 1,           done: false, later: false },
            { id: 3, description: "Task C", projectId: 2,           done: false, later: false }
        ]
        client.Projects = [
            { id: 1, name: "Project 1", later: false },
            { id: 2, name: "Project 2", later: false }
        ]
        render(<TaskView client={client} />)

        await sleep(1)

        screen.getByRole("checkbox", { name: "All projects"}).click()
        screen.getByRole("checkbox", { name: "Project 1"}).click()
        screen.getByRole("checkbox", { name: "No project"}).click()

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "All projects"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Project 1"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Project 2"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "No project"})).not.toBeChecked()

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(1)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task B")
    })

    it("shows tasks from multiple selected projects", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: undefined,   done: false, later: false },
            { id: 2, description: "Task B", projectId: 1,           done: false, later: false },
            { id: 3, description: "Task C", projectId: 2,           done: false, later: false }
        ]
        client.Projects = [
            { id: 1, name: "Project 1", later: false },
            { id: 2, name: "Project 2", later: false },
            { id: 3, name: "Project 3", later: false }
        ]
        render(<TaskView client={client} />)

        await sleep(1)

        screen.getByRole("checkbox", { name: "All projects"}).click()
        screen.getByRole("checkbox", { name: "No project"}).click()
        screen.getByRole("checkbox", { name: "Project 1"}).click()
        screen.getByRole("checkbox", { name: "Project 2"}).click()

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "All projects"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Project 1"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Project 2"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Project 3"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "No project"})).not.toBeChecked()

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(2)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task B")
        expect(items[1].querySelector('[data-testId="description"]')?.textContent).toBe("Task C")
    })
})