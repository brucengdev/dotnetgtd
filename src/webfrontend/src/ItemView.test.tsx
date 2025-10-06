import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Project } from "./models/Project";
import { Item } from "./models/Item";

const testProjects: Project[] = [
                { id: 1, name: "Project A", done: false, later: false },
                { id: 2, name: "Project B", done: false, later: false }
            ];

describe("ItemView", () => {
    [
        { 
            testCaseName: "renders view correctly with project name = Project A",
            item: {
                id: 1,
                description: "Task description",
                done: false,
                later: false,
                projectId: 1
            } as Item,
            expectedDisplayedProjectName: "Project A",
            tagNames: [],
            expectedDisplayedTags: ""
        },
        { 
            testCaseName: "renders view correctly with undefined project name",
            item: {
                id: 1,
                description: "Task description",
                done: false,
                later: true
            } as Item,
            projectName: undefined,
            expectedDisplayedProjectName: "",
            tagNames: [],
            expectedDisplayedTags: "",
        },
        { 
            testCaseName: "renders view correctly with empty project name",
            item: {
                id: 1,
                description: "Task description",
                done: true,
                later: false
            } as Item,
            projectName: "",
            expectedDisplayedProjectName: "",
            tagNames: [],
            expectedDisplayedTags: "",
        },
        { 
            testCaseName: "renders view correctly with 1 tag",
            item: {
                id: 1,
                description: "Task description",
                done: true,
                later: true,
                projectId: 1
            } as Item,
            projectName: "Project A",
            expectedDisplayedProjectName: "Project A",
            tagNames: ["tag1"],
            expectedDisplayedTags: "tag1",
        },
        { 
            testCaseName: "renders view correctly with multiple tags",
            item: {
                id: 1,
                description: "Task description",
                done: false,
                later: false,
                projectId: 1
            } as Item,
            expectedDisplayedProjectName: "Project A",
            tagNames: ["tag1", "tag2"],
            expectedDisplayedTags: "tag1,tag2",
        }
    ].forEach(testCase => {
        const {
            testCaseName, item, 
            expectedDisplayedProjectName,
            tagNames, expectedDisplayedTags
        } = testCase
        it(testCaseName, () => {
            const { description, done, later } = item
            render(<ItemView 
                    item={item}
                    projects={testProjects}
                    tagNames={tagNames} 
                />)

            const descriptionView = screen.getByTestId("description")
            expect(descriptionView).toBeInTheDocument()
            expect(descriptionView.textContent).toBe(description)

            const projectNameView = screen.getByTestId("project")
            expect(projectNameView).toBeInTheDocument()
            expect(projectNameView.textContent).toBe(expectedDisplayedProjectName)

            const tagNamesView = screen.getByTestId("tags")
            expect(tagNamesView).toBeInTheDocument()
            expect(tagNamesView.textContent).toBe(expectedDisplayedTags)

            const doneView = screen.getByTestId("done")
            if(done) {
                expect(doneView).toBeChecked()
            }else {
                expect(doneView).not.toBeChecked()
            }

            const laterView = screen.getByTestId("later")
            if(later) {
                expect(laterView).toBeChecked()
            }else {
                expect(laterView).not.toBeChecked()
            }

            const deleteButton = screen.getByRole("button", { name: "Delete" })
            expect(deleteButton).toBeInTheDocument()

            expect(screen.queryByTestId("confirmDeleteView"))
                .not.toBeInTheDocument()
        })
    })

    it("shows delete confirm view when delete is clicked", () => {
        render(<ItemView 
                item={{
                    id: 1,
                    description:"Test Description",
                    done:false,
                    later:false
                }}
                projects={testProjects}
                />)

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton)

        expect(screen.getByTestId("confirmDeleteView")).toBeInTheDocument()
        expect(deleteButton).not.toBeInTheDocument()
    })

    it("hides delete confirm view when no is clicked", () => {
        render(<ItemView item={{
            id: 1,
            description:"Test Description",
            done: false,
            later: false
        }} projects={testProjects} />)

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton)

        fireEvent.click(screen.getByRole("button", { name: "No" }))
        expect(screen.queryByTestId("confirmDeleteView"))
                .not.toBeInTheDocument()
    })

    it("executes onDelete when yes is clicked", () => {
        const onDelete = vitest.fn()
        render(<ItemView 
            item={{
                id: 1,
                description:"Test Description",
                done: false,
                later: false
            }}
            projects={testProjects}
            onDelete={onDelete} />)

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton)

        fireEvent.click(screen.getByRole("button", { name: "Yes" }))
        expect(onDelete).toHaveBeenCalled()
    })
})