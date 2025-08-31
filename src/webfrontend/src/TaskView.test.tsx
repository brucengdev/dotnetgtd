import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TaskView } from "./TaskView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("TaskView", () => {
    it("has necessary ui components", () => {
        render(<TaskView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        expect(addItemButton).toBeInTheDocument()

        expect(screen.queryByRole("heading", { name: "New task"})).not.toBeInTheDocument()

        expect(screen.getByTestId("item-list")).toBeInTheDocument()
    })

    it("shows add item form when button Add is clicked", () => {
        render(<TaskView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        expect(screen.getByTestId("add-item-form")).toBeInTheDocument()

        expect(screen.queryByRole("button", { name: "Add"})).not.toBeInTheDocument()
    })

    it("hides the add item form when cancel is clicked", () => {
        render(<TaskView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        fireEvent.click(screen.getByRole("button", { name: "Cancel"}))

        expect(screen.queryByTestId("add-item-form")).not.toBeInTheDocument()

        expect(screen.queryByRole("button", { name: "Add"})).toBeInTheDocument()
    })

    it("hides the add item form when create is clicked", async () => {
        render(<TaskView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        fireEvent.click(screen.getByRole("button", { name: "Create"}))

        await sleep(10)

        expect(screen.queryByTestId("add-item-form")).not.toBeInTheDocument()

        expect(screen.queryByRole("button", { name: "Add"})).toBeInTheDocument()
    })

    it("refresh the item list after a new item is created", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0 }
        ]
        render(<TaskView client={client} />)

        await sleep(10)

        let items = screen.queryAllByTestId("item")
        expect(items.length).toBe(1)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task A")
        expect(items[0].querySelector('[data-testId="project"]')?.textContent).toBe("")
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        fireEvent.change(screen.getByRole("textbox", { name: "Description"}), { target: { value: "Task B"}})

        fireEvent.click(screen.getByRole("button", { name: "Create"}))

        await sleep(10)

        items = screen.queryAllByTestId("item")
        expect(items.length).toBe(2)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task A")
        expect(items[1].querySelector('[data-testId="description"]')?.textContent).toBe("Task B")
    })

    
    it("call delete item and refresh list after an item is deleted", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0},
            { id: 2, description: "Task B", projectId: 0},
            { id: 3, description: "Task C", projectId: 0}
        ]
        render(<TaskView client={client} />)

        await sleep(10)

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(3)

        const deleteButtons = screen.getAllByRole("button", { name: "Delete" })
        fireEvent.click(deleteButtons[1])

        fireEvent.click(screen.getByRole("button", { name: "Yes" }))
        await sleep(10)

        expect(client.Items.length).toBe(2)
    })

})