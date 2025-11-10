import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it, vitest} from 'vitest'
import '@testing-library/jest-dom'
import { TaskView } from "./TaskView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import userEvent from "@testing-library/user-event";
import { TaskFilter } from "./TaskFilters";
import cartesian from "fast-cartesian";
import { AssertHighlightedProjectFilter } from "./TaskFilters.projectHighlight.test";

describe("TaskView", () => {
    it("has necessary ui components", () => {
        render(<TaskView client={new TestClient()} />)

        const addItemButton = screen.getByRole("button", { name: "Add"})
        expect(addItemButton).toBeInTheDocument()

        expect(screen.queryByRole("heading", { name: "New task"})).not.toBeInTheDocument()

        expect(screen.getByTestId("item-list")).toBeInTheDocument()
        expect(screen.getByTestId("task-filters")).toBeInTheDocument()
    })

    it("shows add item form when button Add is clicked", () => {
        render(<TaskView client={new TestClient()} />)

        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        expect(screen.getByTestId("add-item-form")).toBeInTheDocument()

        expect(screen.queryByRole("button", { name: "Add"})).not.toBeInTheDocument()
    })

    it("passes filter to add item form to filter project dropdown list", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Active uncompleted project",    later: false,   done: false }, 
            { id: 2, name: "Active completed project",      later: false,   done: true },
            { id: 3, name: "Inactive uncompleted project",  later: true,    done: false }, 
            { id: 4, name: "Inactive completed project",    later: true,    done: true },
        ]
        render(<TaskView client={client} filter={{active: true, completed: true}} />)

        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)
        await sleep(1)

        const projectOptions = screen.getAllByRole("option")
        const projectNames = projectOptions.map(o => o.textContent)

        expect(projectNames).toEqual([
            "[No project]",
            "Active completed project"
        ])
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
            { id: 1, description: "Task A", projectId: 0, done: false, later: false }
        ]
        client.Projects = [
            { id: 1, name: "Project X", later: false, done: false }
        ]
        client.Tags = [
            { id: 1, name: "Tag 1" },
            { id: 2, name: "Tag 2" }
        ]
        render(<TaskView client={client} />)

        await sleep(1)

        let items = screen.queryAllByTestId("item")
        expect(items.length).toBe(1)
        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task A")
        expect(items[0].querySelector('[data-testId="project"]')?.textContent).toBe("")

        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        await sleep(1)

        fireEvent.change(screen.getByRole("textbox", { name: "Description"}), { target: { value: "Task B"}})
        fireEvent.change(screen.getByRole("combobox", { name: "Project"}), { target: { value: 1 } })
        userEvent.selectOptions(screen.getByRole("listbox", { name: "Tags"}), ["1", "2"])

        await sleep(1)

        fireEvent.click(screen.getByRole("button", { name: "Create"}))

        await sleep(1)

        items = screen.queryAllByTestId("item")
        expect(items.length).toBe(2)

        expect(items[0].querySelector('[data-testId="description"]')?.textContent).toBe("Task B")
        expect(items[0].querySelector('[data-testId="project"]')?.textContent).toBe("Project X")
        expect(items[0].querySelector('[data-testId="tags"]')?.textContent).toBe("Tag 1,Tag 2")

        expect(items[1].querySelector('[data-testId="description"]')?.textContent).toBe("Task A")
        expect(items[1].querySelector('[data-testId="project"]')?.textContent).toBe("")
    })


    it("call delete item and refresh list after an item is deleted", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0, done: false, later: false},
            { id: 2, description: "Task B", projectId: 0, done: false, later: false},
            { id: 3, description: "Task C", projectId: 0, done: false, later: false}
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

    cartesian([
        [true, undefined],//active
        [true, undefined],//inactive
        [true, undefined],//completed
        [true, undefined] //uncompleted
    ]).forEach(([active, inactive, completed, uncompleted]) => {

        it(`calls server to fetch items when active=${active}`
            +`,inactive=${inactive},completed=${completed}`
            +`,uncompleted=${uncompleted}`, async () => {
            const client = new TestClient()
            client.GetItems = vitest.fn(async (_: TaskFilter) => [])
            client.Items = [
                { id: 1, description: "Task A", projectId: 0, done: false, later: false}
            ]
            render(<TaskView client={client} filter={{}} />)

            await sleep(1)

            if(active) {
                fireEvent.click(screen.getByRole("checkbox", { name: "Active tasks"}))
            }
            if(inactive) {
                fireEvent.click(screen.getByRole("checkbox", { name: "Inactive tasks"}))
            }
            if(completed) {
                fireEvent.click(screen.getByRole("checkbox", { name: "Completed tasks"}))
            }
            if(uncompleted) {
                fireEvent.click(screen.getByRole("checkbox", { name: "Uncompleted tasks"}))
            }

            await sleep(1)

            const expectedFilter: TaskFilter = {active, inactive, completed, uncompleted}
            Object.keys(expectedFilter).forEach(key => {
                const k = key as keyof TaskFilter
                if(expectedFilter[k] === undefined) {
                    delete expectedFilter[k]
                }
            })
            expect(client.GetItems).toHaveBeenCalledWith(expectedFilter)
        })
    })

    it("refreshes the item list after an item is updated", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0, done: false, later: false },
            { id: 2, description: "Task B", projectId: 1, done: false, later: false }
        ]
        client.Projects = [
            { id: 1, name: "Project X", later: false, done: false }
        ]
        client.Tags = [
            { id: 1, name: "Tag 1" },
            { id: 2, name: "Tag 2" }
        ]
        render(<TaskView client={client} />)

        await sleep(1)

        const items = screen.queryAllByTestId("description")
        
        fireEvent.click(items[1])
        await sleep(1)

        fireEvent.change(screen.getByTestId("edit-description"), { target: { value: "Task B Updated"}})
        fireEvent.click(screen.getByRole("button", { name: "✓"}))
        await sleep(1)

        const updatedItems = screen.queryAllByTestId("description")
        expect(updatedItems[1].textContent).toBe("Task B Updated")
    })

    
    it("highlight project filters with no tasks and remove highlight when new task is created", async () => {
        const client = new TestClient()
        client.Projects = [
            {
                id: 1, name: "Project A", later: false, done: false
            }
        ]
        render(<TaskView 
            client={client}
        />)
        await sleep(1)

        AssertHighlightedProjectFilter("Project A", true)

        fireEvent.click(screen.getByRole("button", { name: "Add" }))
        fireEvent.change(screen.getByRole("combobox", { name: "Project"}), { target: { value: 1 } })
        fireEvent.change(screen.getByRole("textbox", { name: "Description"}), { target: { value: "Task 1"}})
        fireEvent.click(screen.getByRole("button", { name: "Create"}))
        await sleep(1)

        AssertHighlightedProjectFilter("Project A", false)
    })
})