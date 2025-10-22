import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Project } from "./models/Project";
import { Item } from "./models/Item";
import { Tag } from "./models/Tag";

const testProjects: Project[] = [
    { id: 1, name: "Uncompleted Active Project", done: false, later: false },
    { id: 2, name: "Completed Active Project", done: true, later: false },
    { id: 3, name: "Uncompleted Inactive Project", done: false, later: true },
    { id: 4, name: "Completed Inactive Project", done: true, later: true }
];

const testTags: Tag[] = [
    { id: 1, name: "tag1" },
    { id: 2, name: "tag2" }
]

describe("ItemView", () => {
    [
        { 
            testCaseName: "renders view correctly with project name = Uncompleted Active Project",
            item: {
                id: 1,
                description: "Task description",
                done: false,
                later: false,
                projectId: 1,
            } as Item,
            expectedDisplayedProjectName: "Uncompleted Active Project",
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
            expectedDisplayedProjectName: "Uncompleted Active Project",
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
            expectedDisplayedProjectName: "Uncompleted Active Project",
            expectedDisplayedTags: "tag1,tag2",
            expectedDoneStatus: false,
            expectedLaterStatus: false
        },
        { 
            testCaseName: "shows uncompleted task as completed if project is completed",
            item: {
                id: 1,
                description: "Task description",
                done: false,
                later: false,
                projectId: testProjects.find(p => p.name == "Completed Active Project")?.id
            } as Item,
            expectedDisplayedProjectName: "Completed Active Project",
            expectedDisplayedTags: "",
            expectedDoneStatus: true,
            expectedLaterStatus: false
        },
        { 
            testCaseName: "shows completed task as completed if project is completed",
            item: {
                id: 1,
                description: "Task description",
                done: true,
                later: false,
                projectId: testProjects.find(p => p.name == "Completed Active Project")?.id
            } as Item,
            expectedDisplayedProjectName: "Completed Active Project",
            expectedDisplayedTags: "",
            expectedDoneStatus: true,
            expectedLaterStatus: false
        },
         { 
            testCaseName: "shows uncompleted task as uncompleted if project is uncompleted",
            item: {
                id: 1,
                description: "Task description",
                done: false,
                later: false,
                projectId: testProjects.find(p => p.name == "Uncompleted Active Project")?.id
            } as Item,
            expectedDisplayedProjectName: "Uncompleted Active Project",
            expectedDisplayedTags: "",
            expectedDoneStatus: false,
            expectedLaterStatus: false
        },
        { 
            testCaseName: "shows completed task as completed if project is uncompleted",
            item: {
                id: 1,
                description: "Task description",
                done: true,
                later: false,
                projectId: testProjects.find(p => p.name == "Uncompleted Active Project")?.id
            } as Item,
            expectedDisplayedProjectName: "Uncompleted Active Project",
            expectedDisplayedTags: "",
            expectedDoneStatus: true,
            expectedLaterStatus: false
        },
        { 
            testCaseName: "shows active task as active if project is active",
            item: {
                id: 1,
                description: "Task description",
                done: false,
                later: false,
                projectId: testProjects.find(p => p.name == "Uncompleted Active Project")?.id
            } as Item,
            expectedDisplayedProjectName: "Uncompleted Active Project",
            expectedDisplayedTags: "",
            expectedDoneStatus: false,
            expectedLaterStatus: false
        },
    ].forEach(testCase => {
        const {
            testCaseName, item, 
            expectedDisplayedProjectName,
            expectedDisplayedTags,
            expectedDoneStatus,
            expectedLaterStatus
        } = testCase
        it(testCaseName, () => {
            const { description } = item
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