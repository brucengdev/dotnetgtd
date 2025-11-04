import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TaskView } from "./TaskView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("TaskView", () => {
    it(`filters project dropdown list in item view is sorted by project name`, async () => {
        const client = new TestClient()
        client.Items = [
            { id: 1, description: "Task A", projectId: 0, done: false, later: false },
        ]
        client.Projects = [
            { id: 1, name: "Project D", later: false, done: false },
            { id: 2, name: "Project C", later: false, done: false },
            { id: 1, name: "Project A", later: false, done: false },
            { id: 1, name: "Project B", later: false, done: false },
        ]
        render(<TaskView client={client} 
            filter={{uncompleted: true, active: true, inactive: true}} />)
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
})