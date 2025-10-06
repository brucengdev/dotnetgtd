import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Project } from "./models/Project";
import { Tag } from "./models/Tag";

const testProjects: Project[] = [
    { id: 1, name: "ProjectX", done: false, later: false },
    { id: 2, name: "ProjectY", done: false, later: false }
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

    it("Executes callback when done is changed", () => {
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

        screen.getByRole("checkbox", { name: "Done" }).click()

        expect(fn).toHaveBeenCalledWith({
            id: 1,
            description: "Task A",
            done: true,
            later: false,
            tagIds: [1, 2],
            projectId: 1
        })
    })

    it("Executes callback when later is changed", () => {
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

        screen.getByRole("checkbox", { name: "Later" }).click()

        expect(fn).toHaveBeenCalledWith({
            id: 1,
            description: "Task A",
            done: false,
            later: true,
            tagIds: [1, 2],
            projectId: 1
        })
    })
})