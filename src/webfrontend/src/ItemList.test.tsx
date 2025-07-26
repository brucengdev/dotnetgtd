import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import ItemList from "./ItemList";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("ItemList", () => {
    it("shows message when there are no items", () => {
        render(<ItemList client={new TestClient()} />)
        expect(screen.getByText("There are no items.")).toBeInTheDocument()
    })

    it("shows a list of items", async () => {
        const testClient = new TestClient()
        testClient.Items = [
            { description: "Task A" },
            { description: "Task B" }
        ]
        render(<ItemList client={testClient} />)

        await sleep(10)

        const items = screen.getAllByTestId("item")
        expect(items.length).toBe(2)

        expect(items[0].querySelector('[data-testid="description"]')?.textContent).toBe("Task A")
        expect(items[1].querySelector('[data-testid="description"]')?.textContent).toBe("Task B")

        expect(screen.queryByText("There are no items.")).not.toBeInTheDocument()
    })
})