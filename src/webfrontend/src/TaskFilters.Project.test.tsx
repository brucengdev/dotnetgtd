import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskFilter, TaskFilters } from "./TaskFilters";
import { TestClient } from "./__test__/TestClient";
import '@testing-library/jest-dom'
import { sleep } from "./__test__/testutils";
import { useState } from "react";

interface WrapperProps {
    client: TestClient
    filter: TaskFilter
    onFiltersChanged?: (filter: TaskFilter) => void
}

// a component to wrap TaskFilters for testing
const WrapperComponent = (props: WrapperProps) => {
    const {client, onFiltersChanged } = props
    const [filter, setFilter] = useState(props.filter)
    return <TaskFilters client={client} 
        filter={filter}
        onFiltersChanged={(newFilter) => {
            setFilter(newFilter)
            onFiltersChanged?.(newFilter)
        }}
    />
}

describe("TaskFilters", () => {
    it("shows project filters sorted by name", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "C Project", done: false, later: false },
            { id: 2, name: "D Project", done: true, later: false },
            { id: 3, name: "A Project", done: false, later: false },
            { id: 4, name: "B Project", done: true, later: false },
        ]
        render(<WrapperComponent client={client} filter={{}} />)
        await sleep(1)

        const checkboxes = screen.getAllByRole("checkbox").filter(cb => cb.parentElement?.textContent.endsWith(" Project"))
        const projectFilters = checkboxes.map(cb => cb.parentElement?.textContent??"")
        expect(projectFilters).toEqual([
            "A Project", "B Project", "C Project", "D Project"
        ])
    })

    it("should only shows uncompleted project filters if uncompleted is checked", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Uncompleted project", done: false, later: false },
            { id: 2, name: "Completed project", done: true, later: false },
        ]
        render(<WrapperComponent client={client} filter={{}} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Uncompleted tasks"})).not.toBeChecked()
        fireEvent.click(screen.getByRole("checkbox", {name: "Uncompleted tasks"}))
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Uncompleted tasks"})).toBeChecked()

        expect(screen.getByRole("checkbox", {name: "Uncompleted project"})).toBeInTheDocument()
        expect(screen.queryByRole("checkbox", {name: "Completed project"})).not.toBeInTheDocument()
    })

    it("should only shows completed project filters if completed is checked", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Uncompleted project", done: false, later: false },
            { id: 2, name: "Completed project", done: true, later: false },
        ]
        render(<WrapperComponent client={client} filter={{}} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Completed tasks"})).not.toBeChecked()
        fireEvent.click(screen.getByRole("checkbox", {name: "Completed tasks"}))
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Completed tasks"})).toBeChecked()

        expect(screen.queryByRole("checkbox", {name: "Uncompleted project"})).not.toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Completed project"})).toBeInTheDocument()
    })

    it("Shows both completed and uncompleted project filters", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Uncompleted project", done: false, later: false },
            { id: 2, name: "Completed project", done: true, later: false },
        ]
        render(<WrapperComponent client={client} filter={{}} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Completed tasks"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", {name: "Uncompleted tasks"})).not.toBeChecked()
        fireEvent.click(screen.getByRole("checkbox", {name: "Completed tasks"}))
        await sleep(1)
        fireEvent.click(screen.getByRole("checkbox", {name: "Uncompleted tasks"}))
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Completed tasks"})).toBeChecked()
        expect(screen.getByRole("checkbox", {name: "Uncompleted tasks"})).toBeChecked()

        expect(screen.getByRole("checkbox", {name: "Uncompleted project"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Completed project"})).toBeInTheDocument()
    })

    it("should only shows active project filters if active is checked", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Active project", done: false, later: false },
            { id: 2, name: "Inactive project", done: false, later: true },
        ]
        render(<WrapperComponent client={client} filter={{}} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Active tasks"})).not.toBeChecked()
        fireEvent.click(screen.getByRole("checkbox", {name: "Active tasks"}))
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Active tasks"})).toBeChecked()

        expect(screen.getByRole("checkbox", {name: "Active project"})).toBeInTheDocument()
        expect(screen.queryByRole("checkbox", {name: "Inactive project"})).not.toBeInTheDocument()
    })

    it("should only shows inactive project filters if inactive is checked", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Active project", done: false, later: false },
            { id: 2, name: "Inactive project", done: false, later: true },
        ]
        render(<WrapperComponent client={client} filter={{}} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Inactive tasks"})).not.toBeChecked()
        fireEvent.click(screen.getByRole("checkbox", {name: "Inactive tasks"}))
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Inactive tasks"})).toBeChecked()

        expect(screen.queryByRole("checkbox", {name: "Active project"})).not.toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Inactive project"})).toBeInTheDocument()
    })

    it("shows both active and inactive project filters when both active and inactive filters are checked", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Active project", done: false, later: false },
            { id: 2, name: "Inactive project", done: false, later: true },
        ]
        render(<WrapperComponent client={client} filter={{}} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Inactive tasks"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", {name: "Active tasks"})).not.toBeChecked()
        fireEvent.click(screen.getByRole("checkbox", {name: "Inactive tasks"}))
        await sleep(1)
        fireEvent.click(screen.getByRole("checkbox", {name: "Active tasks"}))
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Inactive tasks"})).toBeChecked()
        expect(screen.getByRole("checkbox", {name: "Active tasks"})).toBeChecked()

        expect(screen.getByRole("checkbox", {name: "Active project"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Inactive project"})).toBeInTheDocument()
    })

    it("Shows only active completed project filters", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Active completed project", done: true, later: false },
            { id: 2, name: "Active uncompleted project", done: false, later: false },
            { id: 3, name: "Inactive completed project", done: true, later: true },
            { id: 4, name: "Inactive uncompleted project", done: false, later: true },
        ]
        render(<WrapperComponent client={client} filter={{}} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Completed tasks" })).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Active tasks" })).not.toBeChecked()
        fireEvent.click(screen.getByRole("checkbox", { name: "Completed tasks" }))
        await sleep(1)
        fireEvent.click(screen.getByRole("checkbox", { name: "Active tasks" }))
        await sleep(1)

        expect(screen.queryByRole("checkbox", { name: "Active completed project" })).toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Active uncompleted project" })).not.toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Inactive completed project" })).not.toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Inactive uncompleted project" })).not.toBeInTheDocument()
    })

    it("Shows only active uncompleted project filters", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Active completed project", done: true, later: false },
            { id: 2, name: "Active uncompleted project", done: false, later: false },
            { id: 3, name: "Inactive completed project", done: true, later: true },
            { id: 4, name: "Inactive uncompleted project", done: false, later: true },
        ]
        render(<WrapperComponent client={client} filter={{}} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", { name: "Uncompleted tasks" })).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Active tasks" })).not.toBeChecked()
        fireEvent.click(screen.getByRole("checkbox", { name: "Uncompleted tasks" }))
        await sleep(1)
        fireEvent.click(screen.getByRole("checkbox", { name: "Active tasks" }))
        await sleep(1)

        expect(screen.queryByRole("checkbox", { name: "Active completed project" })).not.toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Active uncompleted project" })).toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Inactive completed project" })).not.toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Inactive uncompleted project" })).not.toBeInTheDocument()
    })

    it("Shows only inactive completed project filters", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Active completed project", done: true, later: false },
            { id: 2, name: "Active uncompleted project", done: false, later: false },
            { id: 3, name: "Inactive completed project", done: true, later: true },
            { id: 4, name: "Inactive uncompleted project", done: false, later: true },
        ]
        render(<WrapperComponent client={client} filter={{}} />)
        await sleep(1)
        expect(screen.getByRole("checkbox", { name: "Completed tasks" })).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Inactive tasks" })).not.toBeChecked()
        fireEvent.click(screen.getByRole("checkbox", { name: "Completed tasks" }))
        await sleep(1)
        fireEvent.click(screen.getByRole("checkbox", { name: "Inactive tasks" }))
        await sleep(1)

        expect(screen.queryByRole("checkbox", { name: "Active completed project" })).not.toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Active uncompleted project" })).not.toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Inactive completed project" })).toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Inactive uncompleted project" })).not.toBeInTheDocument()
    })

    it("Shows only inactive uncompleted project filters", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Active completed project", done: true, later: false },
            { id: 2, name: "Active uncompleted project", done: false, later: false },
            { id: 3, name: "Inactive completed project", done: true, later: true },
            { id: 4, name: "Inactive uncompleted project", done: false, later: true },
        ]
        render(<WrapperComponent client={client} filter={{}} />)
        await sleep(1)
        expect(screen.getByRole("checkbox", { name: "Uncompleted tasks" })).not.toBeChecked()
        expect(screen.getByRole("checkbox", { name: "Inactive tasks" })).not.toBeChecked()
        fireEvent.click(screen.getByRole("checkbox", { name: "Uncompleted tasks" }))
        await sleep(1)
        fireEvent.click(screen.getByRole("checkbox", { name: "Inactive tasks" }))
        await sleep(1)

        expect(screen.queryByRole("checkbox", { name: "Active completed project" })).not.toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Active uncompleted project" })).not.toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Inactive completed project" })).not.toBeInTheDocument()
        expect(screen.queryByRole("checkbox", { name: "Inactive uncompleted project" })).toBeInTheDocument()
    })
})