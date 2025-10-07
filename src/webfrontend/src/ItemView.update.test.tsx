import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Project } from "./models/Project";
import { Tag } from "./models/Tag";
import { sleep } from "./__test__/testutils";

const testProjects: Project[] = [
    { id: 1, name: "ProjectX", done: false, later: false },
    { id: 2, name: "ProjectY", done: false, later: false },
    { id: 3, name: "ProjectZ", done: false, later: false }
]

const testTags: Tag[] = [
    { id: 1, name: "tag1" },
    { id: 2, name: "tag2" }
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
})