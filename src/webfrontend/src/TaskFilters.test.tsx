import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskFilters } from "./TaskFilters";
import { TestClient } from "./__test__/TestClient";
import '@testing-library/jest-dom'
import { sleep } from "./__test__/testutils";

describe("TaskFilters views", () => {
    it("shows tag and project filters", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Project 1", later: false },
            { id: 2, name: "Project 2", later: false },
        ]
        client.Tags = [
            { id: 1, name: "Tag 1" },
            { id: 2, name: "Tag 2" },
        ]
        render(<TaskFilters client={client} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "All projects"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "No project"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Project 1"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Project 2"})).toBeInTheDocument()

        expect(screen.getByRole("checkbox", {name: "All tags"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "No tag"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Tag 1"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Tag 2"})).toBeInTheDocument()
    })
})