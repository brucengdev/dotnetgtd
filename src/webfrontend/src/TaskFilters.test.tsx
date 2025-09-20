import { render, screen } from "@testing-library/react";
import { describe, expect, it, vitest } from "vitest";
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
            
        async function setupTest(initialFilter: Filter = {}) {
            const client = new TestClient();
            client.Projects = [
                { id: 1, name: "Project 1", later: false },
                { id: 2, name: "Project 2", later: false },
            ];
            client.Tags = [
                { id: 1, name: "Tag 1" },
                { id: 2, name: "Tag 2" },
            ];
            render(<TaskFilters client={client} filter={initialFilter} onFiltersChanged={fn} />);
            await sleep(1);
        }

        it("completed filter", async() => {
            await setupTest()
            const completedCheckbox = screen.getByRole("checkbox", {name: "Completed tasks"})
            expect(completedCheckbox).not.toBeChecked()
            completedCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.completed).toBe(true)
        })

        it("uncompleted filter", async() => {
            await setupTest()
            const uncompletedCheckbox = screen.getByRole("checkbox", {name: "Uncompleted tasks"})
            expect(uncompletedCheckbox).not.toBeChecked()
            uncompletedCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.uncompleted).toBe(true)
        })

        it("active filter", async() => {
            await setupTest()
            const activeCheckbox = screen.getByRole("checkbox", {name: "Active tasks"})
            expect(activeCheckbox).not.toBeChecked()
            activeCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.active).toBe(true)
        })

        it("inactive filter", async() => {
            await setupTest()
            const inactiveCheckbox = screen.getByRole("checkbox", {name: "Inactive tasks"})
            expect(inactiveCheckbox).not.toBeChecked()
            inactiveCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.inactive).toBe(true)
        })

        it("all projects filter", async() => {
            await setupTest({ projectIds: [1]})
            const allProjectsCheckbox = screen.getByRole("checkbox", {name: "All projects"})
            expect(allProjectsCheckbox).not.toBeChecked()
            allProjectsCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.projectIds).toBe(undefined)
        })

        it("project 1 filter", async() => {
            await setupTest({ projectIds: [] })
            const project1CheckBox = screen.getByRole("checkbox", {name: "Project 1"})
            expect(project1CheckBox).not.toBeChecked()
            project1CheckBox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.projectIds).toStrictEqual([1])
        })

        it("2 projects filters", async() => {
            await setupTest({ projectIds: [1] })
            const project1CheckBox = screen.getByRole("checkbox", {name: "Project 1"})
            const project2CheckBox = screen.getByRole("checkbox", {name: "Project 2"})
            expect(project1CheckBox).toBeChecked()
            expect(project2CheckBox).not.toBeChecked()

            project2CheckBox.click()

            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.projectIds).toStrictEqual([1,2])
        })

        it("no project filter", async() => {
            await setupTest({ projectIds: undefined })
            const noProjectCheckBox = screen.getByRole("checkbox", {name: "No project"})
            expect(noProjectCheckBox).not.toBeChecked()
            noProjectCheckBox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.projectIds).toStrictEqual([])
        })
    })
})