import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { ProjectView } from "./ProjectView";

describe("ProjectView", () => {
    it("has necessary ui components", () => {
        render(<ProjectView />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        expect(addItemButton).toBeInTheDocument()
    })

})