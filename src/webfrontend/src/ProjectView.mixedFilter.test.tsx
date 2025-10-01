import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import { ProjectView } from "./ProjectView";

describe("ProjectView", () => {
    it("get only active and uncompleted projects", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project A", done: true, later: false },
            { id: 2, name: "Project B", done: false, later: false },
            { id: 3, name: "Project C", done: true, later: true },
            { id: 4, name: "Project D", done: false, later: true }
        ]
        render(<ProjectView client={client} />)

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Active projects"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Uncompleted projects"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Inactive projects"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Completed projects"})).not.toBeChecked()

        const items = screen.queryAllByTestId("project")
        expect(items.length).toBe(1)
        expect(items[0].querySelector('[data-testId="name"]')?.textContent).toBe("Project B")
        expect(items[0].querySelector('[data-testId="done"]')).not.toBeChecked()
        expect(items[0].querySelector('[data-testId="later"]')).not.toBeChecked()
    })

    // it("get only inactive and completed tasks", async () => {
    //     const client = new TestClient()
    //     client.Items = [
    //         { id: 1, description: "Task A", projectId: 0, done: true, later: false },
    //         { id: 2, description: "Task B", projectId: 0, done: false, later: false },
    //         { id: 3, description: "Task C", projectId: 0, done: true, later: true },
    //         { id: 4, description: "Task D", projectId: 0, done: false, later: true }
    //     ]
    //     render(<TaskView client={client} />)
        
    //     await sleep(1)
    //     screen.getByRole("checkbox", { name: "Active tasks"}).click()
    //     screen.getByRole("checkbox", { name: "Completed tasks"}).click()
    //     screen.getByRole("checkbox", { name: "Inactive tasks"}).click()
    //     screen.getByRole("checkbox", { name: "Uncompleted tasks"}).click()

    //     await sleep(1)

    //     expect(screen.getByRole("checkbox", { name: "Active tasks"})).not.toBeChecked()
    //     expect(screen.getByRole("checkbox", { name: "Uncompleted tasks"})).not.toBeChecked()
    //     expect(screen.getByRole("checkbox", { name: "Inactive tasks"})).toBeChecked()
    //     expect(screen.getByRole("checkbox", { name: "Completed tasks"})).toBeChecked()

    //     const items = screen.queryAllByTestId("item")
    //     expect(items.length).toBe(1)
    //     expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task C")
    //     expect(items[0].querySelector('[data-testId="project"]')?.textContent).toBe("")
    //     expect(items[0].querySelector('[data-testId="done"]')).toBeChecked()
    //     expect(items[0].querySelector('[data-testId="later"]')).toBeChecked()
    // })
})