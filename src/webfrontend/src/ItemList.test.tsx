import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import ItemList from "./ItemList";

describe("ItemList", () => {
    it("shows message when there are no items", () => {
        render(<ItemList />)
        expect(screen.getByText("There are no items.")).toBeInTheDocument()
    })
})