import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Project } from "./models/Project";
import { Tag } from "./models/Tag";
import { sleep } from "./__test__/testutils";
import userEvent from "@testing-library/user-event";

const testProjects: Project[] = [
    { id: 1, name: "ProjectX", done: false, later: false },
    { id: 2, name: "ProjectY", done: false, later: false },
    { id: 3, name: "ProjectZ", done: false, later: false }
]

const testTags: Tag[] = [
    { id: 1, name: "tag1", userId: 1 },
    { id: 2, name: "tag2", userId: 1 }
]

describe("ItemView update form", () => {
    it("Executes callback when description is changed", () => {
        const fn = vitest.fn()
        render(<ItemView
            item={{
                id: 1,
                description:"Task A" ,
                done:false,
                later:false,
                projectId: 1,
                tagIds: [1,2]
            }}
            projects={testProjects}
            tags={testTags}
            onChange={fn}
        />)

        const descriptionView = screen.getByTestId("description")
        fireEvent.click(descriptionView)

        fireEvent.change(screen.getByTestId("edit-description"), { target: { value: "Task A Updated" } })
        fireEvent.click(screen.getByRole("button", { name: "✓"}))

        expect(fn).toHaveBeenCalledWith({
            id: 1,
            description: "Task A Updated",
            done: false,
            later: false,
            tagIds: [1, 2],
            projectId: 1
        })
    })

    const doneValues = [true, false]
    doneValues.forEach(done => {
        it(`Executes callback when done is changed to ${done}`, () => {
            const fn = vitest.fn()
            render(<ItemView
                item={{
                    id: 1,
                    description:"Task A" ,
                    done:!done,
                    later:false,
                    projectId: 1,
                    tagIds: [1,2]
                }}
                projects={testProjects}
                tags={testTags}
                onChange={fn}
            />)

            screen.getByRole("checkbox", { name: "Done" }).click()

            expect(fn).toHaveBeenCalledWith({
                id: 1,
                description: "Task A",
                done: done,
                later: false,
                tagIds: [1, 2],
                projectId: 1
            })
        })
    })

    const laterValues = [true, false]
    laterValues.forEach(later => {
        it(`Executes callback when later is changed to ${later}`, () => {
            const fn = vitest.fn()
            render(<ItemView
                item={{
                    id: 1,
                    description:"Task A" ,
                    done:false,
                    later: !later,
                    projectId: 1,
                    tagIds: [1,2]
                }}
                projects={testProjects}
                tags={testTags}
                onChange={fn}
            />)

            screen.getByRole("checkbox", { name: "Later" }).click()

            expect(fn).toHaveBeenCalledWith({
                id: 1,
                description: "Task A",
                done: false,
                later: later,
                tagIds: [1, 2],
                projectId: 1
            })
        })
    })

    it(`Shows list of projects when clicked on`, async () => {
        const fn = vitest.fn()
        render(<ItemView
            item={{
                id: 1,
                description:"Task A" ,
                done:false,
                later:false,
                projectId: 1,
                tagIds: [1,2]
            }}
            projects={testProjects}
            tags={testTags}
            onChange={fn}
        />)

        screen.getByTestId("project").click()
        await sleep(1)
        
        expect(screen.getByTestId("edit-project")).toBeInTheDocument()
        expect(screen.getByTestId("edit-project").children.length).toBe(4)
        expect(screen.getByTestId("edit-project").children[0].textContent).toBe("No project")
        expect(screen.getByTestId("edit-project").children[1].textContent).toBe("ProjectX")
        expect(screen.getByTestId("edit-project").children[2].textContent).toBe("ProjectY")
        expect(screen.getByTestId("edit-project").children[3].textContent).toBe("ProjectZ")
    })

    const selectedProjectTestCases = [undefined, 1, 2, 3]
    selectedProjectTestCases.forEach(projectId => {
        it(`Selects correct project in dropdown list`, async () => {
            const fn = vitest.fn()
            render(<ItemView
                item={{
                    id: 1,
                    description:"Task A" ,
                    done:false,
                    later:false,
                    projectId,
                    tagIds: [1,2]
                }}
                projects={testProjects}
                tags={testTags}
                onChange={fn}
            />)

            screen.getByTestId("project").click()
            await sleep(1)
            expect(screen.getByTestId("edit-project")).toHaveValue(projectId?.toString() ?? "")
        })
    })

    const projectValues =[undefined, 1, 2, 3]
    projectValues.forEach(projectId => {
        it(`Executes callback when project is changed to ${projectId}`, async () => {
            const fn = vitest.fn()
            render(<ItemView
                item={{
                    id: 1,
                    description:"Task A" ,
                    done:false,
                    later:false,
                    projectId: 1,
                    tagIds: [1,2]
                }}
                projects={testProjects}
                tags={testTags}
                onChange={fn}
            />)

            screen.getByTestId("project").click()
            await sleep(1)

            fireEvent.change(screen.getByTestId("edit-project"), { target: { value: projectId?.toString()?? "" } })

            expect(fn).toHaveBeenCalledWith({
                id: 1,
                description: "Task A",
                done: false,
                later: false,
                tagIds: [1, 2],
                projectId
            })
        })
    })

    it(`Shows list of tags when clicked on`, async () => {
        const fn = vitest.fn()
        render(<ItemView
            item={{
                id: 1,
                description:"Task A" ,
                done:false,
                later:false,
                projectId: 1,
                tagIds: [1,2]
            }}
            projects={testProjects}
            tags={testTags}
            onChange={fn}
        />)

        screen.getByTestId("tags").click()
        await sleep(1)

        expect(screen.getByTestId("edit-tags")).toBeInTheDocument()
        expect(screen.getByTestId("edit-tags").children.length).toBe(2)
        expect(screen.getByRole("option", { name: "tag1" })).toBeInTheDocument()
        expect(screen.getByRole("option", { name: "tag2" })).toBeInTheDocument()
    })

    const tagSelectionCases = [
        { currentTags: undefined, newSelection: [], newTags:undefined },
        { currentTags: undefined, newSelection: [], newTags: [] },
        { currentTags: undefined, newSelection: ["1"], newTags: [1] },
        { currentTags: [2], newSelection: ["1"], newTags: [1] },
        { currentTags: [1], newSelection: ["1", "2"], newTags: [1, 2] },
        { currentTags: [1], newSelection: ["2"], newTags: [2] }
    ]
    tagSelectionCases.forEach(({ currentTags, newSelection, newTags}) => {
        const newTagsDes = newTags?.map(t => {
            if(t === undefined) { return "undefined" }
            return t
        }).join(',') ?? "undefined"
        it(`executes callback after tags are changed to [${newTagsDes}]`, async () => {
            const fn = vitest.fn()
            render(<ItemView
                item={{
                    id: 1,
                    description:"Task A" ,
                    done:false,
                    later:false,
                    projectId: 1,
                    tagIds: currentTags
                }}
                projects={testProjects}
                tags={testTags}
                onChange={fn}
            />)

            screen.getByTestId("tags").click()
            await sleep(10)

            userEvent.deselectOptions(screen.getByTestId("edit-tags"), currentTags?.map(t => t?.toString()??"") ?? [])
            userEvent.selectOptions(screen.getByTestId("edit-tags"), newSelection)
            await sleep(10)

            const tag1Option = screen.getByTestId("edit-tags").children[0] as HTMLOptionElement
            const tag2Option = screen.getByTestId("edit-tags").children[1] as HTMLOptionElement
            expect(tag1Option.selected).toBe(newTags?.includes(1)??false)
            expect(tag2Option.selected).toBe(newTags?.includes(2)??false)
            
            fireEvent.click(screen.getByRole("button", { name: "✓" }))
            await sleep(10)

            expect(fn).toHaveBeenCalledWith({
                id: 1,
                description:"Task A" ,
                done:false,
                later:false,
                projectId: 1,
                tagIds: newTags || []
            })
        })
    })
})