import { fireEvent, render, screen } from "@testing-library/react";
import {describe, expect, it, vitest} from 'vitest'
import '@testing-library/jest-dom'
import { AddItemForm } from "./AddItemForm";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("AddItemForm", () => {
    it("has necessary ui components", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project 1" }, 
            { id: 2, name: "Project 2" }
        ]
        render(<AddItemForm client={client} onCancel={() => {}}/>)

        await sleep(1)

        expect(screen.getByRole("heading", {name: "New item"})).toBeInTheDocument()
        expect(screen.getByRole("textbox", {name: "Description"})).toBeInTheDocument()

        expect(screen.getByRole("combobox", { name: "Project"})).toBeInTheDocument()

        const defaultProjectOption = screen.getByRole("option", {name: "[No project]"}) as HTMLOptionElement
        expect(defaultProjectOption.getAttribute("value")).toBe("0")
        expect(defaultProjectOption).toBeInTheDocument()
        expect(defaultProjectOption.selected).toBe(true)
        
        const project1 = screen.getByRole("option", {name: "Project 1"}) as HTMLOptionElement
        expect(project1).toBeInTheDocument()
        expect(project1.getAttribute("value")).toBe("1")
        expect(project1.selected).toBe(false)
        
        const project2 = screen.getByRole("option", {name: "Project 2"}) as HTMLOptionElement
        expect(project2).toBeInTheDocument()
        expect(project2.getAttribute("value")).toBe("2")
        expect(project2.selected).toBe(false)

        expect(screen.getByRole("button", {name: "Create"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Cancel"})).toBeInTheDocument()
    })

    it("change project when another project is selected", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project 1" }, 
            { id: 2, name: "Project 2" }
        ]
        render(<AddItemForm client={client} onCancel={() => {}}/>)

        await sleep(1)

        fireEvent.change(screen.getByRole("combobox", { name: "Project"}), { target: { value: 2 } })

        const project2 = screen.getByRole("option", {name: "Project 2"}) as HTMLOptionElement
        expect(project2.selected).toBe(true)

        const project1 = screen.getByRole("option", {name: "Project 1"}) as HTMLOptionElement
        expect(project1.selected).toBe(false)

        const defaultOption = screen.getByRole("option", {name: "[No project]"}) as HTMLOptionElement
        expect(defaultOption.selected).toBe(false)
    })

    it("invokes callback when clicking Cancel", () => {
        const fn = vitest.fn()
        render(<AddItemForm client={new TestClient()} onCancel={fn} />)

        fireEvent.click(screen.getByRole("button", {name: "Cancel"}))
        expect(fn).toHaveBeenCalled()
    })

    var cases = [
        {
            testName: "submits item to backend when clicking Create and no project", 
            taskDescription: "description of a task", projectId: 0 },
        {
            testName: "submits item to backend when clicking Create and Project 1 selected", 
            taskDescription: "task of project 1", projectId: 1 },
        {
            testName: "submits item to backend when clicking Create and Project 2 selected", 
            taskDescription: "task of project 1", projectId: 2 }
    ]
    cases.forEach(({ testName, taskDescription, projectId }) => {
        it(testName, async () => {
            const client = new TestClient()
            client.Projects = [
                { id: 1, name: "Project 1" }, 
                { id: 2, name: "Project 2" }
            ]
            const onCompleted = vitest.fn()
            render(<AddItemForm onCancel={() => {}} client={client} onCompleted={onCompleted} />)

            await sleep(1)

            const descriptionTextBox = screen.getByRole("textbox", { name: "Description"})
            fireEvent.change(descriptionTextBox, { target: { value: taskDescription}})

            fireEvent.change(screen.getByRole("combobox", { name: "Project"}), { target: { value: projectId } })

            expect(descriptionTextBox).toHaveValue(taskDescription)

            fireEvent.click(screen.getByRole("button", { name: "Create"}))
            
            await sleep(1)

            expect(client.Items).toContainEqual({
                id: 0,
                description: taskDescription,
                projectId: projectId
            })

            expect(onCompleted).toHaveBeenCalled()
        })
    })
})