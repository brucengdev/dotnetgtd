import { describe, expect, it } from "vitest";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import { TaskFilters } from "./TaskFilters";
import '@testing-library/jest-dom'
import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";

describe("TaskFilters", () => {
    //a next action is a task with at least one tag
    it("highlight projects with no next actions 2", async () => {
        const projects = [
            { id: 1, name: "Project 1", later: false, done: false },
            { id: 2, name: "Project 2", later: false, done: false, numberOfNextActions: 1 },
            { id: 3, name: "Project 3", later: false, done: false, numberOfNextActions: 2 }
        ]
        render(<TaskFilters projects={projects} client={new TestClient()} />)
        await sleep(1)

        AssertHighlightedProjectFilter("Project 1", true)
        AssertHighlightedProjectFilter("Project 2", false)
        AssertHighlightedProjectFilter("Project 3", false)
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