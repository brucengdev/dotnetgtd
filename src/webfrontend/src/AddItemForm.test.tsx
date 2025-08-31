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
        expect(defaultProjectOption).toBeInTheDocument()
        expect(defaultProjectOption.selected).toBe(true)
        const project1 = screen.getByRole("option", {name: "Project 1"}) as HTMLOptionElement
        expect(project1).toBeInTheDocument()
        expect(project1.getAttribute("value")).toBe("1")
        const project2 = screen.getByRole("option", {name: "Project 2"}) as HTMLOptionElement
        expect(project2).toBeInTheDocument()
        expect(project2.getAttribute("value")).toBe("2")

        expect(screen.getByRole("button", {name: "Create"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Cancel"})).toBeInTheDocument()
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
            taskDescription: "description of a task", project: "[No project]", projectId: 0 }
    ]
    cases.forEach(({ testName, taskDescription, project, projectId }) => {
        it(testName, async () => {
            const client = new TestClient()
            const onCompleted = vitest.fn()
            render(<AddItemForm onCancel={() => {}} client={client} onCompleted={onCompleted} />)

            const descriptionTextBox = screen.getByRole("textbox", { name: "Description"})
            fireEvent.change(descriptionTextBox, { target: { value: taskDescription}})

            expect(descriptionTextBox).toHaveValue(taskDescription)

            fireEvent.click(screen.getByRole("button", { name: "Create"}))

            expect(client.Items).toContainEqual({
                id: 0,
                description: taskDescription,
                projectId: projectId
            })

            await sleep(10)

            expect(onCompleted).toHaveBeenCalled()
        })
    })
})