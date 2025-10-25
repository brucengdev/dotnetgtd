import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TestClient } from "./__test__/TestClient";
import { MainView } from "./MainView";
import { sleep } from "./__test__/testutils";

describe("MainView", () => {
    it("shows buttons to switch between views", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)

        const tasksButton = screen.getByRole("button", { name: "Tasks" })
        const projectsButton = screen.getByRole("button", { name: "Projects" })
        const tagsButton = screen.getByRole("button", { name: "Tags" })

        expect(tasksButton).toBeInTheDocument()
        expect(tasksButton).toHaveClass("bg-indigo-600")
        expect(projectsButton).toBeInTheDocument()
        expect(projectsButton).toHaveClass("bg-gray-300")
        expect(tagsButton).toBeInTheDocument()
        expect(tagsButton).toHaveClass("bg-gray-300")
    })
    it("shows task view and log out button initially", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)
        
        const logoutButton = screen.getByRole("button", { name: "Log out"})
        expect(logoutButton).toBeInTheDocument()

        expect(screen.getByTestId("task-view")).toBeInTheDocument()

        const tasksButton = screen.getByRole("button", { name: "Tasks" })
        const projectsButton = screen.getByRole("button", { name: "Projects" })
        const tagsButton = screen.getByRole("button", { name: "Tags" })

        expect(tasksButton).toHaveClass("bg-indigo-600")
        expect(projectsButton).toHaveClass("bg-gray-300")
        expect(tagsButton).toHaveClass("bg-gray-300")
    })

    it("shows project view after switching to project view", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)

        fireEvent.click(screen.getByRole("button", { name: "Projects" }))

        expect(screen.getByTestId("project-view")).toBeInTheDocument()
        expect(screen.queryByTestId("task-view")).not.toBeInTheDocument()

        const tasksButton = screen.getByRole("button", { name: "Tasks" })
        const projectsButton = screen.getByRole("button", { name: "Projects" })
        const tagsButton = screen.getByRole("button", { name: "Tags" })

        expect(tasksButton).toHaveClass("bg-gray-300")
        expect(projectsButton).toHaveClass("bg-indigo-600")
        expect(tagsButton).toHaveClass("bg-gray-300")
    })

    it("shows tag view after switching to tag view", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)

        fireEvent.click(screen.getByRole("button", { name: "Tags" }))

        expect(screen.getByTestId("tag-view")).toBeInTheDocument()
        expect(screen.queryByTestId("task-view")).not.toBeInTheDocument()
        expect(screen.queryByTestId("project-view")).not.toBeInTheDocument()

        const tasksButton = screen.getByRole("button", { name: "Tasks" })
        const projectsButton = screen.getByRole("button", { name: "Projects" })
        const tagsButton = screen.getByRole("button", { name: "Tags" })
        
        expect(tasksButton).toHaveClass("bg-gray-300")
        expect(projectsButton).toHaveClass("bg-gray-300")
        expect(tagsButton).toHaveClass("bg-indigo-600")
    })

    it("shows task view after switching back from project view", () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)

        fireEvent.click(screen.getByRole("button", { name: "Projects" }))
        fireEvent.click(screen.getByRole("button", { name: "Tasks" }))

        expect(screen.getByTestId("task-view")).toBeInTheDocument()
        expect(screen.queryByTestId("project-view")).not.toBeInTheDocument()

        const tasksButton = screen.getByRole("button", { name: "Tasks" })
        const projectsButton = screen.getByRole("button", { name: "Projects" })
        const tagsButton = screen.getByRole("button", { name: "Tags" })

        expect(tasksButton).toHaveClass("bg-indigo-600")
        expect(projectsButton).toHaveClass("bg-gray-300")
        expect(tagsButton).toHaveClass("bg-gray-300")
    })

    it("remembers current task filters when switching views", async () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)
        await sleep(1)

        const completedTaskCheckbox = screen.getByRole("checkbox", { name: "Completed tasks" })
        expect(completedTaskCheckbox).not.toBeChecked()
        completedTaskCheckbox.click()

        expect(completedTaskCheckbox).toBeChecked()

        const projectButton = screen.getByRole("button", { name: "Projects" })
        fireEvent.click(projectButton)
        await sleep(1)

        const tasksButton = screen.getByRole("button", { name: "Tasks" })
        fireEvent.click(tasksButton)
        await sleep(1)

        const completedTaskCheckboxAfter = screen.getByRole("checkbox", { name: "Completed tasks" })
        expect(completedTaskCheckboxAfter).toBeChecked()
    })

    it("remembers current project filters when switching views", async () => {
        render(<MainView client={new TestClient()} onLogout={() => { }} />)
        await sleep(1)

        const projectsButton = screen.getByRole("button", { name: "Projects" })
        fireEvent.click(projectsButton)
        await sleep(1)

        const completedProjectCheckbox = screen.getByRole("checkbox", { name: "Completed projects" })
        expect(completedProjectCheckbox).not.toBeChecked()
        completedProjectCheckbox.click()
        expect(completedProjectCheckbox).toBeChecked()

        const tasksButton = screen.getByRole("button", { name: "Tasks" })
        fireEvent.click(tasksButton)
        await sleep(1)

        fireEvent.click(projectsButton)
        await sleep(1)

        const completedProjectCheckboxAfter = screen.getByRole("checkbox", { name: "Completed projects" })
        expect(completedProjectCheckboxAfter).toBeChecked()
    })
})