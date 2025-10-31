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
            { id: 1, description: "Item 1", done: false, later: false, projectId: 1, tagIds: [1] },
            { id: 2, description: "Item 2", done: false, later: false, projectId: 1, tagIds: [] },

            { id: 3, description: "Item 3", done: false, later: false, projectId: 2, tagIds: [] },
            { id: 4, description: "Item 4", done: false, later: false, projectId: 2, tagIds: [] },
        ]
        render(<TaskFilters client={client} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Project 1"}).parentElement?.className).not.toContain("text-red-500")
        
        expect(screen.getByRole("checkbox", {name: "Project 2"}).parentElement?.className).toContain("text-red-500")

        expect(screen.getByRole("checkbox", {name: "Project 3"}).parentElement?.className).toContain("text-red-500")
    })


})