import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vitest } from "vitest";
import { Filter, TaskFilters } from "./TaskFilters";
import { TestClient } from "./__test__/TestClient";
import '@testing-library/jest-dom'
import { sleep } from "./__test__/testutils";

describe("TaskFilters views", () => {
    it("shows tag and project filters", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project 1", later: false },
            { id: 2, name: "Project 2", later: false },
        ]
        client.Tags = [
            { id: 1, name: "Tag 1" },
            { id: 2, name: "Tag 2" },
        ]
        render(<TaskFilters client={client} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Active tasks"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Inactive tasks"})).toBeInTheDocument()

        expect(screen.getByRole("checkbox", {name: "Completed tasks"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Uncompleted tasks"})).toBeInTheDocument()

        expect(screen.getByRole("checkbox", {name: "All projects"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "No project"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Project 1"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Project 2"})).toBeInTheDocument()

        expect(screen.getByRole("checkbox", {name: "All tags"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "No tag"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Tag 1"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Tag 2"})).toBeInTheDocument()
    })


    describe("execute callback when filters are changed", async () => {
        let changedFilters: Filter
        const fn = vitest.fn((filter: any) => { changedFilters = filter })
        let initialFilter: Filter = { }
            
        beforeEach(async () => {
            const client = new TestClient()
            client.Projects = [
                { id: 1, name: "Project 1", later: false },
                { id: 2, name: "Project 2", later: false },
            ]
            client.Tags = [
                { id: 1, name: "Tag 1" },
                { id: 2, name: "Tag 2" },
            ]
            render(<TaskFilters client={client} filter={initialFilter} onFiltersChanged={fn} />)
            await sleep(1)
        })

        it("completed filter", async() => {
            const completedCheckbox = screen.getByRole("checkbox", {name: "Completed tasks"})
            expect(completedCheckbox).not.toBeChecked()
            completedCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.completed).toBe(true)
        })

        it("uncompleted filter", async() => {
            const uncompletedCheckbox = screen.getByRole("checkbox", {name: "Uncompleted tasks"})
            expect(uncompletedCheckbox).not.toBeChecked()
            uncompletedCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.uncompleted).toBe(true)
        })

        it("active filter", async() => {
            const activeCheckbox = screen.getByRole("checkbox", {name: "Active tasks"})
            expect(activeCheckbox).not.toBeChecked()
            activeCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.active).toBe(true)
        })

        it("inactive filter", async() => {
            const inactiveCheckbox = screen.getByRole("checkbox", {name: "Inactive tasks"})
            expect(inactiveCheckbox).not.toBeChecked()
            inactiveCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.inactive).toBe(true)
        })
    })
})