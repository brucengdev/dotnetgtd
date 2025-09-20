import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TaskView } from "./TaskView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("TaskView", () => {
    it("shows all tasks initially", async () => {
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

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(3)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task A")
        expect(items[1].querySelector('[data-testId="description"]')?.textContent).toBe("Task B")
        expect(items[2].querySelector('[data-testId="description"]')?.textContent).toBe("Task C")
    })

})