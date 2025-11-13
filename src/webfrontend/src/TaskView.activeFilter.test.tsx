import { screen, render } from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TaskView } from "./TaskView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("TaskView", () => {
    const originalInnerWidth = window.innerWidth
    beforeEach(() => {
        window.innerWidth = 1025 // large screen size
    })
    afterEach(() => {
        window.innerWidth = originalInnerWidth
    })
    it("shows only active tasks initially", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0, done: false, later: false },
            { id: 2, description: "Task B", projectId: 0, done: false, later: true }
        ]
        render(<TaskView client={client} />)

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Active tasks"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Inactive tasks"})).not.toBeChecked()

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(1)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task A")
        expect(items[0].querySelector('[data-testId="project"]')?.textContent).toBe("")
        expect(items[0].querySelector('[data-testId="done"]')).not.toBeChecked()
        expect(items[0].querySelector('[data-testId="later"]')).not.toBeChecked()
    })

    it("get inactive tasks", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0, done: false, later: false },
            { id: 2, description: "Task B", projectId: 0, done: false, later: true }
        ]
        render(<TaskView client={client} />)

        await sleep(1)

        screen.getByRole("checkbox", { name: "Active tasks"}).click()
        screen.getByRole("checkbox", { name: "Inactive tasks"}).click()

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Active tasks"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Inactive tasks"})).toBeChecked()

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(1)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task B")
        expect(items[0].querySelector('[data-testId="project"]')?.textContent).toBe("")
        expect(items[0].querySelector('[data-testId="done"]')).not.toBeChecked()
        expect(items[0].querySelector('[data-testId="later"]')).toBeChecked()
    })

    it("get both active and inactive tasks", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0, done: false, later: false },
            { id: 2, description: "Task B", projectId: 0, done: false, later: true }
        ]
        render(<TaskView client={client} />)

        await sleep(1)

        screen.getByRole("checkbox", { name: "Inactive tasks"}).click()

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Active tasks"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Inactive tasks"})).toBeChecked()

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(2)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task A")
        expect(items[0].querySelector('[data-testId="project"]')?.textContent).toBe("")
        expect(items[0].querySelector('[data-testId="done"]')).not.toBeChecked()
        expect(items[0].querySelector('[data-testId="later"]')).not.toBeChecked()

        expect(items[1].querySelector('[data-testId="description"]')?.textContent).toBe("Task B")
        expect(items[1].querySelector('[data-testId="project"]')?.textContent).toBe("")
        expect(items[1].querySelector('[data-testId="done"]')).not.toBeChecked()
        expect(items[1].querySelector('[data-testId="later"]')).toBeChecked()
    })

    it("get no tasks when both filters are inactive", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0, done: false, later: false },
            { id: 2, description: "Task B", projectId: 0, done: false, later: true }
        ]
        render(<TaskView client={client} />)

        await sleep(1)

        screen.getByRole("checkbox", { name: "Active tasks"}).click()

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Inactive tasks"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Active tasks"})).not.toBeChecked()

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(0)
    })
})