import { describe, expect, it } from "vitest"
import ItemView from "./ItemView"
import { screen, render } from "@testing-library/react";
import '@testing-library/jest-dom'

describe("ItemView", () => {
    it("renders description and delete button", () => {
        render(<ItemView description="Test Description" />)

        const description = screen.getByTestId("description")
        expect(description).toBeInTheDocument()
        expect(description.textContent).toBe("Test Description")

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        expect(deleteButton).toBeInTheDocument()
    })
})