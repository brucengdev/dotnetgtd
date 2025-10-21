import { describe, expect, it } from "vitest";
import { TestClient } from "./TestClient";

describe("TestClient", () => {
    it("should return only uncompleted projects", async () => {
        const client = new TestClient();
        client.Projects = [
            { id: 1, name: "Uncompleted project", done: false, later: false },
            { id: 2, name: "Completed project", done: true, later: false },
        ]
        const projects = await client.GetProjects({ uncompleted: true});
        expect(projects).toEqual([
            { id: 1, name: "Uncompleted project", done: false, later: false },
        ]);
    });
})