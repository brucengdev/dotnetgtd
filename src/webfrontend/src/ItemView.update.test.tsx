import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'

describe("ItemView update form", () => {
    it("Executes callback when description is changed", () => {
        const fn = vitest.fn()
        render(<ItemView
            item={{
                id: 1,
                description:"Task A" ,
                done:false,later:false,
                projectId: 1,
                tagIds: [1,2]
            }}
            projects={[{ id: 1, name: "ProjectX", done: false, later: false }]}
            tags={[
                { id: 1, name: "tag1" },
                { id: 2, name: "tag2" }
            ]}
            onChange={fn}
        />)

        const descriptionView = screen.getByTestId("description")
        fireEvent.click(descriptionView)

        fireEvent.change(screen.getByTestId("edit-description"), { target: { value: "Task A Updated" } })
        fireEvent.click(screen.getByRole("button", { name: "✓"}))

        expect(fn).toHaveBeenCalledWith({
            id: 1,
            description: "Task A Updated",
            done: false,
            later: false,
            tagIds: [1, 2],
            projectId: 1
        })
    })
})