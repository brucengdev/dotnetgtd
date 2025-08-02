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
            { description: "Task A" },
            { description: "Task B" }
        ]
        render(<ItemList items={items} />)

        await sleep(10)

        let itemViews = screen.getAllByTestId("item")
        expect(itemViews.length).toBe(2)

        expect(itemViews[0].querySelector('[data-testid="description"]')?.textContent).toBe("Task A")
        expect(itemViews[1].querySelector('[data-testid="description"]')?.textContent).toBe("Task B")

        expect(screen.queryByText("There are no items.")).not.toBeInTheDocument()
    })

    it("shows a list of items 2", async () => {
        const items = [
            { description: "Task C" },
        ]
        render(<ItemList items={items} />)
        await sleep(10)
        
        let itemViews = screen.getAllByTestId("item")
        expect(itemViews.length).toBe(1)
        expect(itemViews[0].querySelector('[data-testid="description"]')?.textContent).toBe("Task C")
    })

    it("executes onDelete when an item is deleted by user", async () => {
        const items = [
            { description: "Task A" },
            { description: "Task B" },
            { description: "Task C" }
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
        expect(selectedItem).toEqual({ description: "Task B" })
    })
})