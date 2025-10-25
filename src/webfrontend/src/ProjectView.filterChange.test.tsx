import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it, vitest} from 'vitest'
import '@testing-library/jest-dom'
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import { ProjectView } from "./ProjectView";

describe("ProjectView", () => {
    it("executes filter change callback when filters are changed", async () => {
        const filterChangeCallback = vitest.fn()
        const client = new TestClient()
        render(<ProjectView client={client} 
            filter={{uncompleted: true, active: true, inactive: true}} 
            onFilterChange={filterChangeCallback}
        />)
        await sleep(1)

        const completedProjectCheckbox = screen.getByRole("checkbox", { name: "Completed projects" })
        expect(completedProjectCheckbox).not.toBeChecked()
        fireEvent.click(completedProjectCheckbox)
        await sleep(1)

        expect(completedProjectCheckbox).toBeChecked()
        expect(filterChangeCallback).toHaveBeenCalledWith({
            uncompleted: true,
            active: true,
            inactive: true,
            completed: true
        })
    })
})