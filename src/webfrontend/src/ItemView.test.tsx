import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Project } from "./models/Project";
import { Item } from "./models/Item";
import { Tag } from "./models/Tag";

const testProjects: Project[] = [
    { id: 1, name: "Uncompleted Project", done: false, later: false },
    { id: 2, name: "Completed Project", done: true, later: false }
];

const testTags: Tag[] = [
    { id: 1, name: "tag1" },
    { id: 2, name: "tag2" }
]

describe("ItemView", () => {
    [
        { 
            testCaseName: "renders view correctly with project name = Uncompleted Project",
            item: {
                id: 1,
                description: "Task description",
                done: false,
                later: false,
                projectId: 1,
            } as Item,
            expectedDisplayedProjectName: "Uncompleted Project",
            expectedDisplayedTags: "",
            expectedDoneStatus: false,
            expectedLaterStatus: false
        },
        { 
            testCaseName: "renders view correctly with undefined project name",
            item: {
                id: 1,
                description: "Task description",
                done: false,
                later: true
            } as Item,
            expectedDisplayedProjectName: "",
            expectedDisplayedTags: "",
            expectedDoneStatus: false,
            expectedLaterStatus: true
        },
        { 
            testCaseName: "renders view correctly with 1 tag",
            item: {
                id: 1,
                description: "Task description",
                done: true,
                later: true,
                projectId: 1,
                tagIds: [1]
            } as Item,
            expectedDisplayedProjectName: "Uncompleted Project",
            expectedDisplayedTags: "tag1",
            expectedDoneStatus: true,
            expectedLaterStatus: true
        },
        { 
            testCaseName: "renders view correctly with multiple tags",
            item: {
                id: 1,
                description: "Task description",
                done: false,
                later: false,
                projectId: 1,
                tagIds: [1,2]
            } as Item,
            expectedDisplayedProjectName: "Uncompleted Project",
            expectedDisplayedTags: "tag1,tag2",
            expectedDoneStatus: false,
            expectedLaterStatus: false
        }
    ].forEach(testCase => {
        const {
            testCaseName, item, 
            expectedDisplayedProjectName,
            expectedDisplayedTags,
            expectedDoneStatus,
            expectedLaterStatus
        } = testCase
        it(testCaseName, () => {
            const { description, done, later } = item
            render(<ItemView 
                    item={item}
                    projects={testProjects}
                    tags={testTags}
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
            if(expectedDoneStatus) {
                expect(doneView).toBeChecked()
            }else {
                expect(doneView).not.toBeChecked()
            }

            const laterView = screen.getByTestId("later")
            if(expectedLaterStatus) {
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
                tags={testTags}
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
                }} 
                projects={testProjects} 
                tags={testTags} />
        )

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
            tags={testTags}
            onDelete={onDelete} />)

        const deleteButton = screen.getByRole("button", { name: "Delete" })
        fireEvent.click(deleteButton)

        fireEvent.click(screen.getByRole("button", { name: "Yes" }))
        expect(onDelete).toHaveBeenCalled()
    })
})