import { describe, expect, it } from "vitest";
import { TestClient } from "./TestClient";

describe("TestClient", () => {
    it("should return only uncompleted projects", async () => {
        const client = new TestClient();
        client.Projects = [
            { id: 1, name: "Uncompleted project", done: false, later: false },
            { id: 2, name: "Completed project", done: true, later: false },
        ]
        const projects = await client.GetProjects({ uncompleted: true})
        expect(projects).toEqual([
            { id: 1, name: "Uncompleted project", done: false, later: false },
        ])
    })

    it("should return both active and inactive tasks", async () => {
        const client = new TestClient();
        client.Items = [
            { id: 1, description: "Active Task", projectId: 0, done: false, later: false },
            { id: 2, description: "Inactive Task", projectId: 1, done: false, later: true }
        ]
        const items = await client.GetItems({ uncompleted: true, active: true, inactive: true })
        expect(items).toEqual([
            { id: 1, description: "Active Task", projectId: 0, done: false, later: false },
            { id: 2, description: "Inactive Task", projectId: 1, done: false, later: true }
        ])
    })
})