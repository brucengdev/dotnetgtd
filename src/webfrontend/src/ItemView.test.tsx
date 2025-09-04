import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'

describe("ItemView", () => {
    [
        { 
            testCaseName: "renders view correctly with project name = Project A",
            description: "Task description",
            projectName: "Project A",
            expectedDisplayedProjectName: "Project A",
            tagNames: [],
            expectedDisplayedTags: ""
        },
        { 
            testCaseName: "renders view correctly with undefined project name",
            description: "Task description",
            projectName: undefined,
            expectedDisplayedProjectName: "",
            tagNames: [],
            expectedDisplayedTags: ""
        },
        { 
            testCaseName: "renders view correctly with empty project name",
            description: "Task description",
            projectName: "",
            expectedDisplayedProjectName: "",
            tagNames: [],
            expectedDisplayedTags: ""
        },
        { 
            testCaseName: "renders view correctly with 1 tag",
            description: "Task description",
            projectName: "Project A",
            expectedDisplayedProjectName: "Project A",
            tagNames: ["tag1"],
            expectedDisplayedTags: "tag1"
        },
        { 
            testCaseName: "renders view correctly with multiple tags",
            description: "Task description",
            projectName: "Project A",
            expectedDisplayedProjectName: "Project A",
            tagNames: ["tag1", "tag2"],
            expectedDisplayedTags: "tag1,tag2"
        }
    ].forEach(testCase => {
        const {testCaseName, description, 
            projectName, expectedDisplayedProjectName,
            tagNames, expectedDisplayedTags} = testCase
        it(testCaseName, () => {
            render(<ItemView description={description} 
                projectName={projectName} tagNames={tagNames} />)

            const descriptionView = screen.getByTestId("description")
            expect(descriptionView).toBeInTheDocument()
            expect(descriptionView.textContent).toBe(description)

            const projectNameView = screen.getByTestId("project")
            expect(projectNameView).toBeInTheDocument()
            expect(projectNameView.textContent).toBe(expectedDisplayedProjectName)

            const tagNamesView = screen.getByTestId("tags")
            expect(tagNamesView).toBeInTheDocument()
            expect(tagNamesView.textContent).toBe(expectedDisplayedTags)

            const deleteButton = screen.getByRole("button", { name: "Delete" })
            expect(deleteButton).toBeInTheDocument()

            expect(screen.queryByTestId("confirmDeleteView")).not.toBeInTheDocument()
        })
    })

    it("shows delete confirm view when delete is clicked", () => {
        render(<ItemView description="Test Description" />)

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton)

        expect(screen.getByTestId("confirmDeleteView")).toBeInTheDocument()
        expect(deleteButton).not.toBeInTheDocument()
    })

    it("hides delete confirm view when no is clicked", () => {
        render(<ItemView description="Test Description" />)

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton)

        fireEvent.click(screen.getByRole("button", { name: "No" }))
        expect(screen.queryByTestId("confirmDeleteView")).not.toBeInTheDocument()
    })

    it("executes onDelete when yes is clicked", () => {
        const onDelete = vitest.fn()
        render(<ItemView description="Test Description" onDelete={onDelete} />)

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton)

        fireEvent.click(screen.getByRole("button", { name: "Yes" }))
        expect(onDelete).toHaveBeenCalled()
    })
})