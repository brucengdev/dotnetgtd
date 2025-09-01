import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TestClient } from "./__test__/TestClient";
import { MainView } from "./MainView";

describe("MainView", () => {
    it("shows buttons to switch between views", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)
        
        expect(screen.getByRole("button", { name: "Tasks"})).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Projects"})).toBeInTheDocument()
    })
    it("shows task view and log out button initially", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)
        
        const logoutButton = screen.getByRole("button", { name: "Log out"})
        expect(logoutButton).toBeInTheDocument()

        expect(screen.getByTestId("task-view")).toBeInTheDocument()
    })

    it("shows project view after switching to project view", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)

        fireEvent.click(screen.getByRole("button", { name: "Projects" }))

        expect(screen.getByTestId("project-view")).toBeInTheDocument()
        expect(screen.queryByTestId("task-view")).not.toBeInTheDocument()
    })

    it("shows task view after switching back from project view", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)

        fireEvent.click(screen.getByRole("button", { name: "Projects" }))
        fireEvent.click(screen.getByRole("button", { name: "Tasks" }))

        expect(screen.getByTestId("task-view")).toBeInTheDocument()
        expect(screen.queryByTestId("project-view")).not.toBeInTheDocument()
    })
})