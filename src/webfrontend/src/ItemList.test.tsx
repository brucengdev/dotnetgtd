import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import ItemList from "./ItemList";
import { TestClient } from "./__test__/TestClient";

describe("ItemList", () => {
    it("shows message when there are no items", () => {
        render(<ItemList />)
        expect(screen.getByText("There are no items.")).toBeInTheDocument()
    })

    it("shows a list of items", () => {
        const testClient = new TestClient()
        testClient.Items = [
            { description: "Task A" },
            { description: "Task B" }
        ]
        render(<ItemList client={testClient} />)

        const items = screen.getAllByTestId("item")
        expect(items.length).toBe(2)
    })
})