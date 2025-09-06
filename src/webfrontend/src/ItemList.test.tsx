import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it, vitest} from 'vitest'
import '@testing-library/jest-dom'
import ItemList from "./ItemList";
import { sleep } from "./__test__/testutils";
import { Item } from "./models/Item";

describe("ItemList", () => {
    it("shows message when there are no items", () => {
        render(<ItemList />)
        expect(screen.getByText("There are no items.")).toBeInTheDocument()
    })

    it("shows a list of items", async () => {
        const items = [
            { 
                id: 1, description: "Task A", projectId: 0, 
                done: false, later: true 
            },
            { 
                id: 2, description: "Task B", projectId: 2, tagIds: [1, 2] ,
                done: true, later: false
            }
        ]
        const projects = [
            { id: 2, name: "Project X", later: false }
        ]
        const tags = [
            { id: 1, name: "Tag 1" },
            { id: 2, name: "Tag 2" },
            { id: 3, name: "Tag 3" }
        ]
        render(<ItemList items={items} projects={projects} tags={tags} />)

        await sleep(10)

        let itemViews = screen.getAllByTestId("item")
        expect(itemViews.length).toBe(2)

        expect(itemViews[0].querySelector('[data-testid="description"]')
            ?.textContent).toBe("Task A")
        expect(itemViews[0].querySelector('[data-testid="project"]')
            ?.textContent).toBe("")
        expect(itemViews[0].querySelector('[data-testid="done"]'))
            .not.toBeChecked()
        expect(itemViews[0].querySelector('[data-testid="later"]'))
            .toBeChecked()

        expect(itemViews[1].querySelector('[data-testid="description"]')
            ?.textContent).toBe("Task B")
        expect(itemViews[1].querySelector('[data-testid="project"]')
            ?.textContent).toBe("Project X")
        expect(itemViews[1].querySelector('[data-testid="tags"]')
            ?.textContent).toBe("Tag 1,Tag 2")
        expect(itemViews[1].querySelector('[data-testid="done"]'))
            .toBeChecked()
        expect(itemViews[1].querySelector('[data-testid="later"]'))
            .not.toBeChecked()


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
})