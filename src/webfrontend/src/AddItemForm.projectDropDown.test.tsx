import { render, screen } from "@testing-library/react";
import { describe, expect, it } from 'vitest'
import '@testing-library/jest-dom'
import { AddItemForm } from "./AddItemForm";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import { ProjectFilter } from "./ProjectFilters";

describe("AddItemForm", () => {
    const testCases = [
        { 
            name: "shows all projects when no filter is applied",
            expectedProjectNames: [
                "[No project]", 
                "Active uncompleted project",
                "Active completed project",
                "Inactive uncompleted project",
                "Inactive completed project"
            ] 
        },
        { 
            name: "shows all projects when no empty filter is applied",
            filter: { } as ProjectFilter,
            expectedProjectNames: [
                "[No project]", 
                "Active uncompleted project",
                "Active completed project",
                "Inactive uncompleted project",
                "Inactive completed project"
            ] 
        },
        { 
            name: "shows only active projects",
            filter: { active: true } as ProjectFilter,
            expectedProjectNames: [
                "[No project]", 
                "Active uncompleted project",
                "Active completed project"
            ] 
        },
        { 
            name: "shows only inactive projects",
            filter: { inactive: true } as ProjectFilter,
            expectedProjectNames: [
                "[No project]", 
                "Inactive uncompleted project",
                "Inactive completed project"
            ] 
        },
        { 
            name: "shows only completed projects",
            filter: { completed: true } as ProjectFilter,
            expectedProjectNames: [
                "[No project]", 
                "Active completed project",
                "Inactive completed project"
            ] 
        },
        { 
            name: "shows only uncompleted projects",
            filter: { uncompleted: true } as ProjectFilter,
            expectedProjectNames: [
                "[No project]", 
                "Active uncompleted project",
                "Inactive uncompleted project"
            ] 
        },
        { 
            name: "shows only active uncompleted projects",
            filter: { uncompleted: true, active: true } as ProjectFilter,
            expectedProjectNames: [
                "[No project]", 
                "Active uncompleted project"
            ] 
        },
        { 
            name: "shows only active completed projects",
            filter: { completed: true, active: true } as ProjectFilter,
            expectedProjectNames: [
                "[No project]", 
                "Active completed project"
            ] 
        },
        { 
            name: "shows only inactive completed projects",
            filter: { completed: true, inactive: true } as ProjectFilter,
            expectedProjectNames: [
                "[No project]", 
                "Inactive completed project"
            ] 
        },
        { 
            name: "shows only inactive uncompleted projects",
            filter: { uncompleted: true, inactive: true } as ProjectFilter,
            expectedProjectNames: [
                "[No project]", 
                "Inactive uncompleted project"
            ] 
        }
    ]
    testCases.forEach(({name, filter, expectedProjectNames}) => {
        it(name, async () => {
            const client = new TestClient()
            client.Projects = [
                { id: 1, name: "Active uncompleted project",    later: false,   done: false }, 
                { id: 2, name: "Active completed project",      later: false,   done: true },
                { id: 3, name: "Inactive uncompleted project",  later: true,    done: false }, 
                { id: 4, name: "Inactive completed project",    later: true,    done: true },
            ]
            render(<AddItemForm projectFilter={filter} client={client} onCancel={() => {}}/>)

            await sleep(1)

            expectedProjectNames.forEach(projectName => {
                const projectOption = screen.getByRole("option", {name: projectName}) as HTMLOptionElement
                expect(projectOption).toBeInTheDocument()
                const matchedProject = client.Projects.find(p => p.name === projectName)
                expect(projectOption.getAttribute("value")).toBe(matchedProject?.id.toString()?? "0")
                expect(projectOption.selected).toBe(projectName === "[No project]"? true: false)
            });

            client.Projects
            .filter(p => !expectedProjectNames.includes(p.name))
            .forEach(project => {
                const projectName = project.name
                const projectOption = screen.queryByRole("option", {name: projectName}) as HTMLOptionElement
                expect(projectOption).not.toBeInTheDocument()
            })
        })
    })
})