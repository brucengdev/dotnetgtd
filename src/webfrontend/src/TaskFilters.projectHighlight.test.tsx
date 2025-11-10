import { describe, expect, it } from "vitest";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import { TaskFilters } from "./TaskFilters";
import '@testing-library/jest-dom'
import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";

describe("TaskFilters", () => {
    
    it("highlight projects with no tasks with tags", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project 1", later: false, done: false},
            { id: 2, name: "Project 2", later: false, done: false },
            { id: 3, name: "Project 3", later: false, done: false }
        ]
        client.Tags = [
            { id: 1, name: "Tag 1" },
            { id: 2, name: "Tag 2" }
        ]
        client.Items = [
            //project 1
            { id: 1, description: "Item 1", done: false, later: false, projectId: 1, tagIds: [1] },
            { id: 2, description: "Item 2", done: false, later: false, projectId: 1, tagIds: [] },

            //project 2
            { id: 3, description: "Item 3", done: false, later: false, projectId: 2, tagIds: [] },
            { id: 4, description: "Item 4", done: false, later: false, projectId: 2, tagIds: [] },

            //project 3
            //completed action with tag should not count
            { id: 5, description: "Item 5", done: true, later: false, projectId: 3, tagIds: [1] },
        ]
        render(<TaskFilters client={client} />)
        await sleep(1)

        AssertHighlightedProjectFilter("Project 1", false)
        AssertHighlightedProjectFilter("Project 2", true)
        AssertHighlightedProjectFilter("Project 3", true)
    })


})

export function AssertHighlightedProjectFilter(projectName: string, shouldBeHighlighted: boolean) {
    const className = screen.getByRole("checkbox", {name: projectName}).parentElement?.className
    if(shouldBeHighlighted) {
        expect(className).toContain("text-red-500")
    }else {
        expect(className).not.toContain("text-red-500")
    }
}