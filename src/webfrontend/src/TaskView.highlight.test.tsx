import { fireEvent } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import { describe, it } from "vitest"
import { TestClient } from "./__test__/TestClient"
import { sleep } from "./__test__/testutils"
import { AssertHighlightedProjectFilter } from "./TaskFilters.projectHighlight.test"
import { TaskView } from "./TaskView"
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"

describe("TaskView ", () => {
        
    it("highlight project filters with no labelled tasks and remove highlight when new task is created", async () => {
        const client = new TestClient()
        client.Projects = [
            {
                id: 1, name: "Project A", later: false, done: false
            }
        ]
        client.Tags = [
            { id: 1, name: "Tag 1" }
        ]
        render(<TaskView 
            client={client}
        />)
        await sleep(10)

        AssertHighlightedProjectFilter("Project A", true)

        fireEvent.click(screen.getByRole("button", { name: "Add" }))
        await sleep(1)

        fireEvent.change(screen.getByRole("combobox", { name: "Project"}), { target: { value: 1 } })
        userEvent.selectOptions(screen.getByRole("listbox", { name: "Tags"}), ["1"])
        fireEvent.change(screen.getByRole("textbox", { name: "Description"}), { target: { value: "Task 1"}})
        fireEvent.click(screen.getByRole("button", { name: "Create"}))
        await sleep(1)

        AssertHighlightedProjectFilter("Project A", false)
    })

    it("highlight project filters with no labelled tasks and remove highlight task is updated", async () => {
        const client = new TestClient()
        client.Projects = [
            {
                id: 1, name: "Project A", later: false, done: false
            }
        ]
        client.Tags = [
            { id: 1, name: "Tag 1" }
        ]
        client.Items = [
            { id: 1, description: "Task 1", projectId: 1, done: false, later: false }
        ]
        render(<TaskView 
            client={client}
        />)
        await sleep(1)

        AssertHighlightedProjectFilter("Project A", true)

        fireEvent.click(screen.getByTestId("tags"))
        userEvent.selectOptions(screen.getByTestId("edit-tags"), ["1"])
        fireEvent.click(screen.getByRole("button", { name: "✓"}))
        await sleep(1)

        AssertHighlightedProjectFilter("Project A", false)
    })

    it("should not highlight project filters when task filter is changed", async () => {
        const client = new TestClient()
        client.Projects = [
            {
                id: 1, name: "Project A", later: false, done: false
            }
        ]
        client.Tags = [
            { id: 1, name: "Tag 1" }
        ]
        client.Items = [
            { id: 1, description: "Task 1", projectId: 1, tagIds: [1] , done: false, later: false }
        ]
        render(<TaskView 
            client={client}
        />)
        await sleep(1)

        AssertHighlightedProjectFilter("Project A", false)

        fireEvent.click(screen.getByRole("checkbox", { name: "No project" }))
        await sleep(1)

        AssertHighlightedProjectFilter("Project A", false)
    })
})