import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { MainView } from "./MainView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("MainView", () => {
    it("has necessary ui components", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        expect(addItemButton).toBeInTheDocument()

        const logoutButton = screen.getByRole("button", { name: "Log out"})
        expect(logoutButton).toBeInTheDocument()

        expect(screen.queryByRole("heading", { name: "New task"})).not.toBeInTheDocument()

        expect(screen.getByTestId("item-list")).toBeInTheDocument()
    })

    it("shows add item form when button Add is clicked", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        expect(screen.getByTestId("add-item-form")).toBeInTheDocument()

        expect(screen.queryByRole("button", { name: "Add"})).not.toBeInTheDocument()
    })

    it("hides the add item form when cancel is clicked", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        fireEvent.click(screen.getByRole("button", { name: "Cancel"}))

        expect(screen.queryByTestId("add-item-form")).not.toBeInTheDocument()

        expect(screen.queryByRole("button", { name: "Add"})).toBeInTheDocument()
    })

    it("hides the add item form when create is clicked", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        fireEvent.click(screen.getByRole("button", { name: "Create"}))

        expect(screen.queryByTestId("add-item-form")).not.toBeInTheDocument()

        expect(screen.queryByRole("button", { name: "Add"})).toBeInTheDocument()
    })

    it("refresh the item list after a new item is created", async () => {
        const client = new TestClient()
        client.Items = [
            { description: "Task A"}
        ]
        render(<MainView client={client} onLogout={() => { }} />)

        await sleep(10)

        const items = screen.queryAllByTestId("item")
        expect(items.length).toBe(1)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        fireEvent.click(screen.getByRole("button", { name: "Create"}))
    })
})