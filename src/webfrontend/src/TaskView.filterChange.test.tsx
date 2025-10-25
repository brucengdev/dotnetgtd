import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it, vitest} from 'vitest'
import '@testing-library/jest-dom'
import { TaskView } from "./TaskView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";

describe("TaskView", () => {
    it("executes filter change callback when task filters are changed", async () => {
        const filterChangeCallback = vitest.fn()
        const client = new TestClient()
        render(<TaskView client={client} 
            filter={{uncompleted: true, active: true, inactive: true}} 
            onFilterChange={filterChangeCallback}
        />)
        await sleep(1)

        const completedCheckbox = screen.getByRole("checkbox", { name: "Completed tasks" })
        expect(completedCheckbox).not.toBeChecked()
        fireEvent.click(completedCheckbox)
        await sleep(1)

        expect(completedCheckbox).toBeChecked()
        expect(filterChangeCallback).toHaveBeenCalledWith({
            completed: true,
            uncompleted: true, active: true, inactive: true
        })
    })
})