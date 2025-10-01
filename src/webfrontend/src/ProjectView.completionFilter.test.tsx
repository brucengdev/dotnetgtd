import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import { ProjectView } from "./ProjectView";

describe("ProjectView", () => {
    it("shows only uncompleted projects initially", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project A", done: false, later: false },
            { id: 2, name: "Project B", done: true, later: false }
        ]
        render(<ProjectView client={client} />)

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Uncompleted projects"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Completed projects"})).not.toBeChecked()

        const items = screen.queryAllByTestId("project")
        expect(items.length).toBe(1)
        expect(items[0].querySelector('[data-testId="name"]')?.textContent).toBe("Project A")
        expect(items[0].querySelector('[data-testId="done"]')).not.toBeChecked()
        expect(items[0].querySelector('[data-testId="later"]')).not.toBeChecked()
    })

    it("get completed projects", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project A", done: false, later: false },
            { id: 2, name: "Project B", done: true, later: false }
        ]
        render(<ProjectView client={client} />)

        await sleep(1)

        screen.getByRole("checkbox", { name: "Completed projects"}).click()
        screen.getByRole("checkbox", { name: "Uncompleted projects"}).click()

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Completed projects"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Uncompleted projects"})).not.toBeChecked()

        const items = screen.queryAllByTestId("project")
        expect(items.length).toBe(1)
        expect(items[0].querySelector('[data-testId="name"]')?.textContent).toBe("Project B")
        expect(items[0].querySelector('[data-testId="done"]')).toBeChecked()
        expect(items[0].querySelector('[data-testId="later"]')).not.toBeChecked()
    })

    it("get both completed and uncompleted projects", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project A", done: false, later: false },
            { id: 2, name: "Project B", done: true, later: false }
        ]
        render(<ProjectView client={client} />)

        await sleep(1)

        screen.getByRole("checkbox", { name: "Completed projects"}).click()

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Completed projects"})).toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Uncompleted projects"})).toBeChecked()

        const items = screen.queryAllByTestId("project")
        expect(items.length).toBe(2)
        expect(items[0].querySelector('[data-testId="name"]')?.textContent).toBe("Project A")
        expect(items[0].querySelector('[data-testId="done"]')).not.toBeChecked()
        expect(items[0].querySelector('[data-testId="later"]')).not.toBeChecked()

        expect(items[1].querySelector('[data-testId="name"]')?.textContent).toBe("Project B")
        expect(items[1].querySelector('[data-testId="done"]')).toBeChecked()
        expect(items[1].querySelector('[data-testId="later"]')).not.toBeChecked()
    })

    it("get no projects when both filters are unchecked", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project A", done: false, later: false },
            { id: 2, name: "Project B", done: true, later: false }
        ]
        render(<ProjectView client={client} />)

        await sleep(1)

        screen.getByRole("checkbox", { name: "Uncompleted projects"}).click()

        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Uncompleted projects"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Completed projects"})).not.toBeChecked()

        const items = screen.queryAllByTestId("project")
        expect(items.length).toBe(0)
    })
})