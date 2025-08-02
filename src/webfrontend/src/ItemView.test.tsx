import { describe, expect, it } from "vitest"
import ItemView from "./ItemView"
import { screen, render } from "@testing-library/react";
import '@testing-library/jest-dom'

describe("ItemView", () => {
    it("renders description", () => {
        render(<ItemView description="Test Description" />)

        const description = screen.getByTestId("description")
        expect(description).toBeInTheDocument()

    })
})