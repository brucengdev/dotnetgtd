import { render, screen } from "@testing-library/react";
import { describe, expect, it, vitest } from "vitest";
import { TaskFilter, TaskFilters } from "./TaskFilters";
import { TestClient } from "./__test__/TestClient";
import '@testing-library/jest-dom'
import { sleep } from "./__test__/testutils";

describe("TaskFilters views", () => {
    it("shows tag and project filters", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project 1", later: false, done: false},
            { id: 2, name: "Project 2", later: false, done: false }
        ]
        client.Tags = [
            { id: 1, name: "Tag 1" },
            { id: 2, name: "Tag 2" }
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

    it("highlight projects with no tasks with tags", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project 1", later: false, done: false},
            { id: 2, name: "Project 2", later: false, done: false }
        ]
        client.Tags = [
            { id: 1, name: "Tag 1" },
            { id: 2, name: "Tag 2" }
        ]
        client.Items = [
            { id: 1, description: "Item 1", done: false, later: false, projectId: 1, tagIds: [1] },
            { id: 2, description: "Item 2", done: false, later: false, projectId: 2 },
        ]
        render(<TaskFilters client={client} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Project 1"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Project 1"})).not.toHaveClass("text-red-500")
        expect(screen.getByRole("checkbox", {name: "Project 2"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Project 2"})).toHaveClass("text-red-500")
    })


    describe("execute callback when filters are changed", async () => {
        let changedFilters: TaskFilter
        const fn = vitest.fn((filter: any) => { changedFilters = filter })
            
        async function setupTest(initialFilter: TaskFilter = {}) {
            const client = new TestClient();
            client.Projects = [
                { id: 1, name: "Project 1", later: false, done: false},
                { id: 2, name: "Project 2", later: false, done: false },
                { id: 3, name: "Project 3", later: false, done: false },
            ];
            client.Tags = [
                { id: 1, name: "Tag 1" },
                { id: 2, name: "Tag 2" },
                { id: 3, name: "Tag 3" }
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
            expect(changedFilters).toEqual({
                completed: true
            })
        })

        it("uncompleted filter", async() => {
            await setupTest()
            const uncompletedCheckbox = screen.getByRole("checkbox", {name: "Uncompleted tasks"})
            expect(uncompletedCheckbox).not.toBeChecked()
            uncompletedCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                uncompleted: true
            })
        })

        it("active filter", async() => {
            await setupTest()
            const activeCheckbox = screen.getByRole("checkbox", {name: "Active tasks"})
            expect(activeCheckbox).not.toBeChecked()
            activeCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                active: true
            })
        })

        it("inactive filter", async() => {
            await setupTest()
            const inactiveCheckbox = screen.getByRole("checkbox", {name: "Inactive tasks"})
            expect(inactiveCheckbox).not.toBeChecked()
            inactiveCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters!.inactive).toBe(true)
            expect(changedFilters).toEqual({
                inactive: true
            })
        })

        it("all projects filter is checked", async() => {
            await setupTest({ projectIds: ["1"]})
            const allProjectsCheckbox = screen.getByRole("checkbox", {name: "All projects"})
            expect(allProjectsCheckbox).not.toBeChecked()
            allProjectsCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: ["nonnull"]
            })
        })

        it("all projects filter is unchecked", async() => {
            await setupTest({ projectIds: ["nonnull", "null"]})
            const allProjectsCheckbox = screen.getByRole("checkbox", {name: "All projects"})
            expect(allProjectsCheckbox).toBeChecked()

            allProjectsCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: ["null"]
            })
        })

        it("project 1 is checked", async() => {
            await setupTest({ projectIds: [] })
            const project1CheckBox = screen.getByRole("checkbox", {name: "Project 1"})
            expect(project1CheckBox).not.toBeChecked()
            project1CheckBox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: ["1"]
            })
        })

        it("2 projects is checked", async() => {
            await setupTest({ projectIds: ["1"] })
            const project1CheckBox = screen.getByRole("checkbox", {name: "Project 1"})
            const project2CheckBox = screen.getByRole("checkbox", {name: "Project 2"})
            expect(project1CheckBox).toBeChecked()
            expect(project2CheckBox).not.toBeChecked()

            project2CheckBox.click()

            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: ["1","2"]
            })
        })

        it("last project is checked", async() => {
            await setupTest({ projectIds: ["1", "2"] })
            const project1CheckBox = screen.getByRole("checkbox", {name: "Project 1"})
            const project2CheckBox = screen.getByRole("checkbox", {name: "Project 2"})
            const project3CheckBox = screen.getByRole("checkbox", {name: "Project 3"})
            expect(project1CheckBox).toBeChecked()
            expect(project2CheckBox).toBeChecked()
            expect(project3CheckBox).not.toBeChecked()

            project3CheckBox.click()

            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: ["nonnull"]
            })
        })

        it("1 project is unchecked while another is checked", async() => {
            await setupTest({ projectIds: ["1", "2"] })
            const project1CheckBox = screen.getByRole("checkbox", {name: "Project 1"})
            const project2CheckBox = screen.getByRole("checkbox", {name: "Project 2"})
            expect(project1CheckBox).toBeChecked()
            expect(project2CheckBox).toBeChecked()

            project2CheckBox.click()

            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: ["1"]
            })
        })

        it("last project is unchecked", async() => {
            await setupTest({ projectIds: ["1"] })
            const project1CheckBox = screen.getByRole("checkbox", {name: "Project 1"})
            expect(project1CheckBox).toBeChecked()

            project1CheckBox.click()

            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: []
            })
        })

        it("no project is checked", async() => {
            await setupTest({ projectIds: ["nonnull"] })
            const noProjectCheckBox = screen.getByRole("checkbox", {name: "No project"})
            expect(noProjectCheckBox).not.toBeChecked()
            noProjectCheckBox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: ["nonnull", "null"]
            })
        })

        it("all project filter is checked", async() => {
            await setupTest({ projectIds: ["null", "1","2"] })
            const project3CheckBox = screen.getByRole("checkbox", {name: "Project 3"})
            expect(project3CheckBox).not.toBeChecked()
            project3CheckBox.click()

            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: ["null", "nonnull"]
            })
        })

        it("a project filter is unchecked when all project is checked", async() => {
            await setupTest({ projectIds: ["null", "nonnull"] })
            expect(screen.getByRole("checkbox", {name: "All projects"})).toBeChecked()
            expect(screen.getByRole("checkbox", {name: "No project"})).toBeChecked()
            expect(screen.getByRole("checkbox", {name: "Project 1"})).toBeChecked()
            expect(screen.getByRole("checkbox", {name: "Project 2"})).toBeChecked()
            const project3CheckBox = screen.getByRole("checkbox", {name: "Project 3"})
            expect(project3CheckBox).toBeChecked()
            project3CheckBox.click()

            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: ["null", "1", "2"]
            })
        })


        it("All project filter is unchecked. 1", async() => {
            await setupTest({ projectIds: ["nonnull", "null"] })
            const allProjectsCheckbox = screen.getByRole("checkbox", {name: "All projects"})
            expect(allProjectsCheckbox).toBeChecked()
            expect(screen.getByRole("checkbox", {name: "No project"})).toBeChecked()

            allProjectsCheckbox.click()

            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: ["null"]
            })
        })

        it("All project filter is unchecked. 2", async() => {
            await setupTest({ projectIds: ["null", "nonnull", "1", "2"] })
            const allProjectsCheckbox = screen.getByRole("checkbox", {name: "All projects"})
            expect(allProjectsCheckbox).toBeChecked()
            expect(screen.getByRole("checkbox", {name: "No project"})).toBeChecked()
            
            allProjectsCheckbox.click()

            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                projectIds: ["null"]
            })
        })

        it("all tags filter is checked", async() => {
            await setupTest({ tagIds: ["1", "null"]})
            
            const allTagsCheckbox = screen.getByRole("checkbox", {name: "All tags"})
            expect(allTagsCheckbox).not.toBeChecked()

            allTagsCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                tagIds: ["null", "nonnull"]
            })
        })

        it("all tags filter is unchecked", async() => {
            await setupTest({ tagIds: ["nonnull", "null"]})
            
            const allTagsCheckbox = screen.getByRole("checkbox", {name: "All tags"})
            expect(allTagsCheckbox).toBeChecked()

            allTagsCheckbox.click()
            
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                tagIds: ["null"]
            })
        })

        it("no tag filter is checked", async() => {
            await setupTest({ tagIds: ["1"]})
            
            const noTagCheckbox = screen.getByRole("checkbox", {name: "No tag"})
            expect(noTagCheckbox).not.toBeChecked()

            noTagCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                tagIds: ["1", "null"]
            })
        })

        it("no tag filter is unchecked 1", async() => {
            await setupTest({ tagIds: ["null", "1"]})
            
            const noTagCheckbox = screen.getByRole("checkbox", {name: "No tag"})
            expect(noTagCheckbox).toBeChecked()

            noTagCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                tagIds: ["1"]
            })
        })

        it("no tag filter is unchecked 2", async() => {
            await setupTest({ tagIds: ["null", "nonnull"]})
            
            const noTagCheckbox = screen.getByRole("checkbox", {name: "No tag"})
            expect(noTagCheckbox).toBeChecked()

            noTagCheckbox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                tagIds: ["nonnull"]
            })
        })

        it("a tag is selected", async() => {
            await setupTest({ tagIds: ["null"]})
            
            const tag1CheckBox = screen.getByRole("checkbox", {name: "Tag 1"})
            expect(tag1CheckBox).not.toBeChecked()

            tag1CheckBox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                tagIds: ["null", "1"]
            })
        })

        it("two tags are selected", async() => {
            await setupTest({ tagIds: ["1", "null"]})
            
            const tag2CheckBox = screen.getByRole("checkbox", {name: "Tag 2"})
            expect(tag2CheckBox).not.toBeChecked()

            tag2CheckBox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                tagIds: ["1", "null", "2"]
            })
        })

        it("last tag is selected so all tags are selected", async() => {
            await setupTest({ tagIds: ["1", "2", "null"]})
            
            const tag3CheckBox = screen.getByRole("checkbox", {name: "Tag 3"})
            expect(tag3CheckBox).not.toBeChecked()

            tag3CheckBox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                tagIds: ["null", "nonnull"]
            })
        })

        it("a tag is unselected when all tag filter is unchecked", async() => {
            await setupTest({ tagIds: ["1", "2", "null"]})
            
            expect(screen.getByRole("checkbox", {name: "All tags"})).not.toBeChecked()
            const tag1CheckBox = screen.getByRole("checkbox", {name: "Tag 1"})
            expect(tag1CheckBox).toBeChecked()
            expect(screen.getByRole("checkbox", {name: "Tag 2"})).toBeChecked()
            expect(screen.getByRole("checkbox", {name: "Tag 3"})).not.toBeChecked()

            tag1CheckBox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                tagIds: ["2", "null"]
            })
        })

        it("a tag is unselected when all tag filter is checked", async() => {
            await setupTest({ tagIds: ["nonnull", "null"]})
            
            const tag1CheckBox = screen.getByRole("checkbox", {name: "Tag 1"})
            expect(tag1CheckBox).toBeChecked()

            tag1CheckBox.click()
            expect(fn).toHaveBeenCalled()
            expect(changedFilters).toEqual({
                tagIds: ["null", "2", "3"]
            })
        })
    })
})