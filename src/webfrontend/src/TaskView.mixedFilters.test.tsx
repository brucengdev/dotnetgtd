import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TaskView } from "./TaskView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("TaskView", () => {
    it("get only active and uncompleted tasks", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0, done: true, later: false },
            { id: 2, description: "Task B", projectId: 0, done: false, later: false },
            { id: 3, description: "Task C", projectId: 0, done: true, later: true },
            { id: 4, description: "Task D", projectId: 0, done: false, later: true }
        ]
        render(<TaskView client={client} />)

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Active tasks"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Uncompleted tasks"})).toBeChecked()

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(1)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task B")
        expect(items[0].querySelector('[data-testId="project"]')?.textContent).toBe("")
        expect(items[0].querySelector('[data-testId="done"]')).not.toBeChecked()
        expect(items[0].querySelector('[data-testId="later"]')).not.toBeChecked()
    })
})