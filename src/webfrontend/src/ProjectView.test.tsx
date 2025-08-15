import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { ProjectView } from "./ProjectView";

describe("ProjectView", () => {
    it("has necessary ui components", () => {
        render(<ProjectView />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        expect(addItemButton).toBeInTheDocument()
    })

    it("shows add project form when button Add is clicked", () => {
        render(<ProjectView />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        expect(screen.getByTestId("add-project-form")).toBeInTheDocument()

        expect(addItemButton).not.toBeInTheDocument()

    })
})