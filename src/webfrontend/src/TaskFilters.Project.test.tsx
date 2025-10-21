import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskFilters } from "./TaskFilters";
import { TestClient } from "./__test__/TestClient";
import '@testing-library/jest-dom'
import { sleep } from "./__test__/testutils";

describe("TaskFilters", () => {
    it("should only shows active project filters if uncompleted is checked", async () => {
        const client = new TestClient()
        client.Projects = [
            { id: 1, name: "Uncompleted project", done: false, later: false },
            { id: 2, name: "Completed project", done: true, later: false },
        ]
        render(<TaskFilters client={client} filter={{uncompleted: true}} />)
        await sleep(1)

        expect(screen.getByRole("checkbox", {name: "Uncompleted tasks"})).toBeChecked()

        expect(screen.getByRole("checkbox", {name: "Uncompleted project"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Completed project"})).not.toBeInTheDocument()
    })
})