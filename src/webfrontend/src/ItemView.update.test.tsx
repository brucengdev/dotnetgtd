import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'

describe("ItemView update form", () => {
    it("Executes callback when description is changed", () => {
        const fn = vitest.fn()
        render(<ItemView description="Task A" 
            projectName="ProjectX" tagNames={["tag1", "tag2"]}
            done={false} later={false} 
            onChange={fn}
        />)

        const descriptionView = screen.getByTestId("description")
        fireEvent.click(descriptionView)

        fireEvent.change(screen.getByTestId("edit-description"), { target: { value: "Task A Updated" } })
        fireEvent.click(screen.getByRole("button", { name: "✓"}))

        expect(fn).toHaveBeenCalledWith({
            description: "Task A Updated",
            done: false,
            id: 0,
            later: false,
            projectId: undefined,
            tagIds: undefined
        })
    })
})