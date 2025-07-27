import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import ItemList from "./ItemList";
import { sleep } from "./__test__/testutils";

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
})