import { screen, render, fireEvent } from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vitest} from 'vitest'
import '@testing-library/jest-dom'
import ItemList from "./ItemList";
import { sleep } from "./__test__/testutils";
import { Item } from "./models/Item";

describe("ItemList", () => {
    const originalInnerWidth = window.innerWidth
    beforeEach(() => {
        window.innerWidth = 1025 // large screen size
    })
    afterEach(() => {
        window.innerWidth = originalInnerWidth
    })
    it("shows message when there are no items", () => {
        render(<ItemList />)
        expect(screen.getByText("There are no items.")).toBeInTheDocument()
    })

    it("shows a list of items with items with tags being first", async () => {
        render(<ItemList items={[
            { 
                id: 3, description: "Task C", tagIds: [1, 2], done: true, later: false
            },
            { 
                id: 1, description: "Task A", done: false, later: true 
            },
            { 
                id: 2, description: "Task B", tagIds: [1, 2], done: true, later: false
            }
        ]} tags={[
            { id: 1, name: "tag1" },
            { id: 2, name: "tag2" }
        ]} />)

        const itemDescriptions = screen.getAllByTestId("description").map(e => e.textContent)
        expect(itemDescriptions).toEqual([
            "Task B", "Task C", "Task A"
        ])
    })

    it("shows a list of items sorted by name", async () => {
        const items = [
            { 
                id: 1, description: "Task C", projectId: 2, tagIds: [1, 2] ,
                done: true, later: false
            },
            { 
                id: 2, description: "Task D", projectId: 0, 
                done: false, later: true 
            },
            { 
                id: 3, description: "Task A", projectId: 0, 
                done: false, later: true 
            },
            { 
                id: 4, description: "Task B", projectId: 2, tagIds: [1, 2] ,
                done: true, later: false
            }
        ]
        const projects = [
            { id: 2, name: "Project X", later: false, done: false }
        ]
        const tags = [
            { id: 1, name: "Tag 1" },
            { id: 2, name: "Tag 2" },
            { id: 3, name: "Tag 3" }
        ]
        render(<ItemList items={items} projects={projects} tags={tags} />)

        await sleep(10)

        let itemViews = screen.getAllByTestId("item")
        expect(itemViews.length).toBe(4)

        expect(itemViews[0].querySelector('[data-testid="description"]')
            ?.textContent).toBe("Task B")
        expect(itemViews[0].querySelector('[data-testid="project"]')
            ?.textContent).toBe("Project X")
        expect(itemViews[0].querySelector('[data-testid="tags"]')
            ?.textContent).toBe("Tag 1,Tag 2")
        expect(itemViews[0].querySelector('[data-testid="done"]'))
            .toBeChecked()
        expect(itemViews[0].querySelector('[data-testid="later"]'))
            .not.toBeChecked()

        expect(itemViews[1].querySelector('[data-testid="description"]')
            ?.textContent).toBe("Task C")
        expect(itemViews[1].querySelector('[data-testid="project"]')
            ?.textContent).toBe("Project X")
        expect(itemViews[1].querySelector('[data-testid="tags"]')
            ?.textContent).toBe("Tag 1,Tag 2")
        expect(itemViews[1].querySelector('[data-testid="done"]'))
            .toBeChecked()
        expect(itemViews[1].querySelector('[data-testid="later"]'))
            .not.toBeChecked()

        expect(itemViews[2].querySelector('[data-testid="description"]')
            ?.textContent).toBe("Task A")
        expect(itemViews[2].querySelector('[data-testid="project"]')
            ?.textContent).toBe("")
        expect(itemViews[2].querySelector('[data-testid="done"]'))
            .not.toBeChecked()
        expect(itemViews[2].querySelector('[data-testid="later"]'))
            .toBeChecked()

        expect(itemViews[3].querySelector('[data-testid="description"]')
            ?.textContent).toBe("Task D")
        expect(itemViews[3].querySelector('[data-testid="project"]')
            ?.textContent).toBe("")
        expect(itemViews[3].querySelector('[data-testid="done"]'))
            .not.toBeChecked()
        expect(itemViews[3].querySelector('[data-testid="later"]'))
            .toBeChecked()


        expect(screen.queryByText("There are no items.")).not.toBeInTheDocument()
    })

    it("shows a list of items 2", async () => {
        const items = [
            { id: 1, description: "Task C", projectId: 1, 
                done: false, later: false },
        ]
        render(<ItemList items={items} />)
        await sleep(10)
        
        let itemViews = screen.getAllByTestId("item")
        expect(itemViews.length).toBe(1)
        expect(itemViews[0].querySelector('[data-testid="description"]')?.textContent).toBe("Task C")
    })

    it("executes onDelete when an item is deleted by user", async () => {
        const items = [
            { id: 1, description: "Task A", projectId: 1, 
                done: false, later: false },
            { id: 2, description: "Task B", projectId: 1, 
                done: false, later: false },
            { id: 3, description: "Task C", projectId: 1, 
                done: false, later: false }
        ]
        let selectedItem: Item | undefined = undefined
        const onDelete = vitest.fn((item: Item) => {
            selectedItem = item
        })
        render(<ItemList items={items} onDelete={onDelete} />)
        await sleep(10)

        //get the delete button for the second item
        const deleteButtons = screen.getAllByRole("button", { name: "Delete" })
        expect(deleteButtons.length).toBe(3)
        const deleteButton = deleteButtons[1]
        fireEvent.click(deleteButton)

        fireEvent.click(screen.getByRole("button", { name: "Yes" }))
        expect(onDelete).toHaveBeenCalled()
        expect(selectedItem).toEqual({ id: 2, description: "Task B", 
            projectId: 1, done: false, later: false })
    })

    it("executes onUpdate when an item is updated by user", async () => {
        const items = [
            { id: 1, description: "Task A", projectId: 1, 
                done: false, later: false },
            { id: 2, description: "Task B", projectId: 1, 
                done: false, later: false },
            { id: 3, description: "Task C", projectId: 1, 
                done: false, later: false }
        ]
        const fn = vitest.fn()
        render(<ItemList items={items} onUpdate={fn} />)
        await sleep(1)

        const descriptions = screen.getAllByTestId("description")
        fireEvent.click(descriptions[1])
        await sleep(1)

        fireEvent.change(screen.getByTestId("edit-description"), { target: { value: "Task B Updated" } })
        await sleep(1)
        fireEvent.click(screen.getByRole("button", { name: "✓" }))
        await sleep(1)

        expect(fn).toHaveBeenCalledWith({ 
            id: 2, description: "Task B Updated", 
            projectId: 1, 
            done: false,
            later: false
        })
    })
})