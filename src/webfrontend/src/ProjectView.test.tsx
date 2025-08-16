import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { ProjectView } from "./ProjectView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("ProjectView", () => {
    it("has necessary ui components", () => {
        render(<ProjectView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        expect(addItemButton).toBeInTheDocument()
    })

    it("shows add project form when button Add is clicked", () => {
        render(<ProjectView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        expect(screen.getByTestId("add-project-form")).toBeInTheDocument()

        expect(addItemButton).not.toBeInTheDocument()

    })

    it("hides add project form when Cancel button is clicked", async () => {
        render(<ProjectView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        expect(screen.getByTestId("add-project-form")).toBeInTheDocument()
        expect(addItemButton).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", { name: "Cancel"}))

        expect(screen.queryByTestId("add-project-form")).not.toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Add"})).toBeInTheDocument()
    })

    it("hides add project form when Create button is clicked", async () => {
        render(<ProjectView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        fireEvent.change(screen.getByRole("textbox", { name: "Name"}), { target: { value: "New Project 1" } })
        fireEvent.click(screen.getByRole("button", { name: "Create"}))

        await sleep(10)

        expect(screen.queryByTestId("add-project-form")).not.toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Add"})).toBeInTheDocument()
    })
})