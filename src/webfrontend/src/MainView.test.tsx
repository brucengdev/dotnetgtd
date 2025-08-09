import { screen, render } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TestClient } from "./__test__/TestClient";
import { MainView } from "./MainView";

describe("MainView", () => {
    it("has necessary ui components", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)
        
        const logoutButton = screen.getByRole("button", { name: "Log out"})
        expect(logoutButton).toBeInTheDocument()
    })
})