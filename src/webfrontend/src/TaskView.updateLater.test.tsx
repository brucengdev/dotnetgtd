import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TaskView } from "./TaskView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("TaskView", () => {
    const cases = [
        { taskLater: false, projectLater: false, expectedLater: true },
        { taskLater: false, projectLater: true, expectedLater: false },
        { taskLater: true, projectLater: false, expectedLater: true },
        { taskLater: true, projectLater: true, expectedLater: false },
    ]
    cases.forEach(({ taskLater, projectLater, expectedLater }, index) => {
        it(`updates project later status when a task's is changed ${index}`, async () => {
            const client = new TestClient()
            client.Items = [
                { id: 1, description: "Task A", projectId: 0, done: false, later: false },
                { id: 2, description: "Task B", projectId: 1, done: false, later: taskLater }
            ]
            client.Projects = [
                { id: 1, name: "Project X", later: projectLater, done: false }
            ]
            render(<TaskView client={client} filter={{uncompleted: true, active: true, inactive: true}} />)
            await sleep(10)

            let laterCheckboxes = screen.getAllByRole("checkbox", { name: "Later" })
            fireEvent.click(laterCheckboxes[1])
            await sleep(10)

            laterCheckboxes = screen.getAllByRole("checkbox", { name: "Later" })
            if(expectedLater) {
                expect(laterCheckboxes[1]).toBeChecked()
                expect(client.Projects[0].later).toBeTruthy()
            } else {
                expect(laterCheckboxes[1]).not.toBeChecked()
                expect(client.Projects[0].later).toBeFalsy()
            }
        })
    })
})