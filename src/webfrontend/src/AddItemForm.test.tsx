import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vitest} from 'vitest'
import '@testing-library/jest-dom'
import { AddItemForm } from "./AddItemForm";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("AddItemForm", () => {
    it("has necessary ui components", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project 1", later: false, done: false }, 
            { id: 2, name: "Project 2", later: false, done: false }
        ]
        client.Tags = [
            { id: 1, name: "Tag 1" }, 
            { id: 2, name: "Tag 2" }
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

        expect(screen.getByRole("listbox", { name: "Tags"})).toBeInTheDocument()

        const tag1 = screen.getByRole("option", {name: "Tag 1"}) as HTMLOptionElement
        expect(tag1).toBeInTheDocument()
        expect(tag1.getAttribute("value")).toBe("1")
        expect(tag1.selected).toBe(false)
        
        const tag2 = screen.getByRole("option", {name: "Tag 2"}) as HTMLOptionElement
        expect(tag2).toBeInTheDocument()
        expect(tag2.getAttribute("value")).toBe("2")
        expect(tag2.selected).toBe(false)

        const doneCheckBox = screen.getByRole("checkbox", { name: "Done"})
        expect(doneCheckBox).toBeInTheDocument()
        expect(doneCheckBox).not.toBeChecked()

        const laterCheckBox = screen.getByRole("checkbox", { name: "Later"})
        expect(laterCheckBox).toBeInTheDocument()
        expect(laterCheckBox).not.toBeChecked()

        expect(screen.getByRole("button", {name: "Create"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Cancel"})).toBeInTheDocument()
    })

    const initialValueCases = [
        { initialValues: { projectId: 2}, expectedProjectId: 2 },
        { initialValues: {}, expectedProjectId: 0 },

        { 
            initialValues: { done: false, later: false }, 
            expectedDone: false, expectedLater: false 
        },
        { 
            initialValues: { done: false, later: true }, 
            expectedDone: false, expectedLater: true 
        },
        { 
            initialValues: { done: true, later: false }, 
            expectedDone: true, expectedLater: false 
        },
        { 
            initialValues: { done: true, later: true }, 
            expectedDone: true, expectedLater: true 
        },
        
        {
            initialValues: { tagIds: [1, 2] }, 
            expectedTagIds: [1, 2] 
        },
    ]
    initialValueCases.forEach(({ initialValues, expectedProjectId, expectedDone, expectedLater, expectedTagIds }) => {
        it(`sets initial value for fields ${JSON.stringify(initialValues)}`, async () => {
            const client = new TestClient()
            client.Projects = [
                { id: 1, name: "Project 1", later: false, done: false},
                { id: 2, name: "Project 2", later: false, done: false}
            ]
            render(<AddItemForm client={client} onCancel={() => {}} initialValues={initialValues} />)
            await sleep(1)

            const projectField = screen.getByRole("combobox", { name: "Project"}) as HTMLSelectElement
            expect(projectField.value).toBe(expectedProjectId?.toString()?? "0")

            const doneCheckBox = screen.getByRole("checkbox", { name: "Done"}) as HTMLInputElement
            expect(doneCheckBox.checked).toBe(expectedDone ?? false)
            const laterCheckBox = screen.getByRole("checkbox", { name: "Later"}) as HTMLInputElement
            expect(laterCheckBox.checked).toBe(expectedLater ?? false)


            const tagField = screen.getByRole("listbox", { name: "Tags"}) as HTMLSelectElement
            const selectedTagOptions = Array.from(tagField.options)
            const selectedTagIds = selectedTagOptions.map(opt => parseInt((opt as HTMLOptionElement).value))
            expect(selectedTagIds).toEqual(expectedTagIds ?? [ ])
        })
    })

    it("change project when another project is selected", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project 1", later: false, done: false}, 
            { id: 2, name: "Project 2", later: false, done: false}
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

    var createItemCases = [
        {
            desc: "Task 1",
            done: false, later: false
        },
        {
            desc: "Task 2",
            done: false, later: true
        },
        {
            desc: "Task 3",
            done: true, later: false
        },
        {
            desc: "Task 4",
            done: true, later: true
        }
    ]
    createItemCases.forEach(test => {
        const { desc, done, later } = test
        it(`creates item with done=${done} and later=${later}`, async () => {
            const client = new TestClient()
            const onCompleted = vitest.fn()
            render(<AddItemForm onCancel={() => {}} client={client} onCompleted={onCompleted} />)

            await sleep(1)

            const descriptionTextBox = screen.getByRole("textbox", { name: "Description"})
            fireEvent.change(descriptionTextBox, { target: { value: desc}})

            const doneCheckBox = screen.getByRole("checkbox", { name: "Done"})
            if(done) {
                fireEvent.click(doneCheckBox)
            }

            const laterCheckBox = screen.getByRole("checkbox", { name: "Later"})
            if(later) {
                fireEvent.click(laterCheckBox)
            }

            expect(descriptionTextBox).toHaveValue(desc)
            if(done) {
                expect(doneCheckBox).toBeChecked()
            }else {
                expect(doneCheckBox).not.toBeChecked()
            }
            if(later) {
                expect(laterCheckBox).toBeChecked()
            }else {
                expect(laterCheckBox).not.toBeChecked()
            }


            fireEvent.click(screen.getByRole("button", { name: "Create"}))
            
            await sleep(1)

            expect(client.Items).toContainEqual({
                id: 0,
                description: desc,
                tagIds: [],
                done: done,
                later: later
            })

            expect(onCompleted).toHaveBeenCalled()
        })
    })

    var projectCases = [
        {
            testName: "submits item to backend when clicking Create and no project", 
            taskDescription: "description of a task", projectId: 0, expectedProjectId: undefined },
        {
            testName: "submits item to backend when clicking Create and Project 1 selected", 
            taskDescription: "task of project 1", projectId: 1, expectedProjectId: 1 },
        {
            testName: "submits item to backend when clicking Create and Project 2 selected", 
            taskDescription: "task of project 2", projectId: 2, expectedProjectId: 2 }
    ]
    projectCases.forEach(({ testName, taskDescription, projectId, expectedProjectId }) => {
        it(testName, async () => {
            const client = new TestClient()
            client.Projects = [
                { id: 1, name: "Project 1", later: false, done: false }, 
                { id: 2, name: "Project 2", later: false, done: false }
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
                projectId: expectedProjectId,
                tagIds: [],
                done: false,
                later: false
            })

            expect(onCompleted).toHaveBeenCalled()
        })
    })

    var tagCases = [
        {
            testName: "submits item to backend when clicking Create and no tags", 
            taskDescription: "description of a task", tagIds: [] },
        {
            testName: "submits item to backend when clicking Create and 1 tag selected", 
            taskDescription: "task of project 1", tagIds: [1] },
        {
            testName: "submits item to backend when clicking Create and 2 tags selected", 
            taskDescription: "task of project 2", tagIds: [1, 2] }
    ]
    tagCases.forEach(({ testName, taskDescription, tagIds }) => {
        it(testName, async () => {
            const client = new TestClient()
            client.Projects = [
                { id: 1, name: "Project 1", later: false, done: false }, 
                { id: 2, name: "Project 2", later: false, done: false }
            ]
            client.Tags = [
                { id: 1, name: "Tag 1" },
                { id: 2, name: "Tag 2" }
            ]
            const onCompleted = vitest.fn()
            render(<AddItemForm onCancel={() => {}} client={client} onCompleted={onCompleted} />)

            await sleep(1)

            const descriptionTextBox = screen.getByRole("textbox", { name: "Description"})
            fireEvent.change(descriptionTextBox, { target: { value: taskDescription}})

            expect(descriptionTextBox).toHaveValue(taskDescription)

            userEvent.selectOptions(screen.getByRole("listbox", { name: "Tags"}), tagIds.map(id => String(id)))

            await sleep(1)

            const tag1 = screen.getByRole("option", {name: "Tag 1"}) as HTMLOptionElement
            expect(tag1.getAttribute("value")).toBe("1")
            expect(tag1.selected).toBe(tagIds.includes(1))
            
            const tag2 = screen.getByRole("option", {name: "Tag 2"}) as HTMLOptionElement
            expect(tag2.getAttribute("value")).toBe("2")
            expect(tag2.selected).toBe(tagIds.includes(2))

            fireEvent.click(screen.getByRole("button", { name: "Create"}))
            
            await sleep(1)

            expect(client.Items).toContainEqual({
                id: 0,
                description: taskDescription,
                projectId: undefined,
                tagIds,
                done: false,
                later: false
            })

            expect(onCompleted).toHaveBeenCalled()
        })
    })
})