import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TaskView } from "./TaskView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import { ProjectFilter } from "./ProjectFilters";

describe("TaskView", () => {
    it(`makes project dropdown list in item view sorted by project name`, async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0, done: false, later: false },
        ]
        client.Projects = [
            { id: 1, name: "Project D", later: false, done: false },
            { id: 2, name: "Project C", later: false, done: false },
            { id: 3, name: "Project A", later: false, done: false },
            { id: 4, name: "Project B", later: false, done: false },
        ]
        render(<TaskView client={client} />)
        await sleep(1)

        fireEvent.click(screen.getByTestId("project"))
        await sleep(1)

        expect(screen.queryByTestId("project")).not.toBeInTheDocument()
        expect(screen.getByTestId("edit-project")).toBeInTheDocument()

        const projectOptions = screen.getByTestId("edit-project").children
        const projectOptionNames = Array.from(projectOptions).map(p => p.textContent)
        expect(projectOptionNames).toEqual(
            ["[No project]", "Project A", "Project B", "Project C", "Project D"]
        )
    })

    const cases = [
        { 
            filter: { uncompleted: true, completed: true, active: true, inactive: true} as ProjectFilter, 
            expectedProjects: [
                "[No project]",
                "Active completed project",
                "Active uncompleted project",
                "Inactive completed project",
                "Inactive uncompleted project" 
            ]
        },
        { 
            filter: { active: true, uncompleted: true } as ProjectFilter, 
            expectedProjects: [
                "[No project]",
                "Active uncompleted project"
            ]
        },
        { 
            filter: { active: true, completed: true } as ProjectFilter, 
            expectedProjects: [
                "[No project]",
                "Active completed project"
            ]
        },
        { 
            filter: { inactive: true, uncompleted: true} as ProjectFilter, 
            expectedProjects: [
                "[No project]",
                "Inactive uncompleted project" 
            ]
        },
        { 
            filter: { inactive: true, completed: true} as ProjectFilter, 
            expectedProjects: [
                "[No project]",
                "Inactive completed project"
            ]
        },
        { 
            filter: { uncompleted: true, active: true, inactive: true } as ProjectFilter, 
            expectedProjects: [
                "[No project]",
                "Active uncompleted project",
                "Inactive uncompleted project" 
            ]
        },
        { 
            filter: { completed: true, active: true, inactive: true } as ProjectFilter, 
            expectedProjects: [
                "[No project]",
                "Active completed project",
                "Inactive completed project"
            ]
        },
        { 
            filter: { active: true, uncompleted: true, completed: true} as ProjectFilter, 
            expectedProjects: [
                "[No project]",
                "Active completed project",
                "Active uncompleted project"
            ]
        },
        { 
            filter: { inactive: true, uncompleted: true, completed: true } as ProjectFilter, 
            expectedProjects: [
                "[No project]",
                "Inactive completed project",
                "Inactive uncompleted project" 
            ]
        }
    ]
    cases.forEach(({ filter, expectedProjects }) => {
        it(`filters project dropdown list in item view with filter ${JSON.stringify(filter)}`, async () => {
            const client = new TestClient()
            client.Items = [
                { id: 1, description: "Active uncompleted task",    later: false,   done: false  },
                { id: 2, description: "Active completed task",      later: false,   done: true   },
                { id: 3, description: "Inactive uncompleted task",  later: true,    done: false  },
                { id: 4, description: "Inactive completed task",    later: true,    done: true   }
            ]
            client.Projects = [
                { id: 1, name: "Active uncompleted project",    later: false,   done: false  },
                { id: 2, name: "Active completed project",      later: false,   done: true   },
                { id: 3, name: "Inactive uncompleted project",  later: true,    done: false  },
                { id: 4, name: "Inactive completed project",    later: true,    done: true   }
            ]
            render(<TaskView client={client} filter={filter} />)
            await sleep(1)

            fireEvent.click(screen.getAllByTestId("project")[0])
            await sleep(1)

            const projectOptions = screen.getAllByTestId("edit-project")[0].children
            const projectOptionNames = Array.from(projectOptions).map(p => p.textContent)
            expect(projectOptionNames).toEqual(expectedProjects)
        })
    })

    it("refreshes project dropdown list when task filters are changed", async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Active uncompleted task",    later: false,   done: false  },
            { id: 2, description: "Active completed task",      later: false,   done: true   },
            { id: 3, description: "Inactive uncompleted task",  later: true,    done: false  },
            { id: 4, description: "Inactive completed task",    later: true,    done: true   }
        ]
        client.Projects = [
            { id: 1, name: "Active uncompleted project",    later: false,   done: false  },
            { id: 2, name: "Active completed project",      later: false,   done: true   },
            { id: 3, name: "Inactive uncompleted project",  later: true,    done: false  },
            { id: 4, name: "Inactive completed project",    later: true,    done: true   }
        ]
        render(<TaskView client={client} filter={{active: true, uncompleted: true}} />)
        await sleep(1)

        fireEvent.click(screen.getAllByTestId("project")[0])
        await sleep(1)
        
        let projectOptions = screen.getAllByTestId("edit-project")[0].children
        let projectOptionNames = Array.from(projectOptions).map(p => p.textContent)
        expect(projectOptionNames).toEqual([
            "[No project]",
            "Active uncompleted project"
        ])

        fireEvent.click(screen.getByRole("checkbox", { name: "Inactive tasks" }))
        await sleep(1)

        fireEvent.click(screen.getAllByTestId("project")[0])
        await sleep(1)

        projectOptions = screen.getAllByTestId("edit-project")[0].children
        projectOptionNames = Array.from(projectOptions).map(p => p.textContent)
        expect(projectOptionNames).toEqual([
            "[No project]",
            "Active uncompleted project",
            "Inactive uncompleted project"
        ])
    })

    const projectCases = [
        { filter: { projectIds: ["2"] }, expectedProjectId: 2 },
    ]
    projectCases.forEach(({ filter, expectedProjectId }) => {
        it(`pre-set values when editing task when filter is ${JSON.stringify(filter)}`, async () => {
            const client = new TestClient()
            client.Projects = [
                { id: 1, name: "Project A", later: false, done: false },
                { id: 2, name: "Project B", later: false, done: false },
            ]
            render(<TaskView client={client} filter={filter} />)
            await sleep(1)

            fireEvent.click(screen.getByRole("button", { name: "Add" }))
            await sleep(1)

            const projectSelect = screen.getByRole("combobox", { name: "Project" }) as HTMLSelectElement
            expect(projectSelect.value).toBe(expectedProjectId.toString())
        })
    })
})