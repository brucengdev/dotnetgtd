import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { MainView } from "./MainView";
import { TestClient } from "./__test__/TestClient";

describe("MainView", () => {
    it("has necessary ui components", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        expect(addItemButton).toBeInTheDocument()

        const logoutButton = screen.getByRole("button", { name: "Log out"})
        expect(logoutButton).toBeInTheDocument()
    })
})