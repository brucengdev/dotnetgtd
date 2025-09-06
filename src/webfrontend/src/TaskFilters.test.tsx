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
        render(<TaskFilters client={client} />)
        await sleep(1)

        expect(screen.getByRole("link", {name: "No project"})).toBeInTheDocument()
        expect(screen.getByRole("link", {name: "Project 1"})).toBeInTheDocument()
        expect(screen.getByRole("link", {name: "Project 2"})).toBeInTheDocument()

        expect(screen.getByRole("link", {name: "No tag"})).toBeInTheDocument()
    })
})