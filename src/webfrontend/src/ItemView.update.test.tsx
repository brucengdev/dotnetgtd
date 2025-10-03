import { describe, expect, it, vitest } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { sleep } from "./__test__/testutils";

describe("ItemView update form", () => {
    it("changes to edit mode when clicked on", async () => {
        render(<ItemView description="Task A" 
            projectName="ProjectX" tagNames={["tag1", "tag2"]}
            done={false} later={false} />)

        expect(screen.queryByTestId("edit-description")).not.toBeInTheDocument()

        const itemView = screen.getByTestId("item")
        itemView.click()

        await sleep(1)

        const input = screen.getByTestId("edit-description")
        expect(input).toBeInTheDocument()
        expect(screen.queryByTestId("description")).not.toBeInTheDocument()

        expect(input).toHaveValue("Task A")
    })

    it("changes back to view mode after losing focus", () => {
        render(<ItemView description="Task A" 
            projectName="ProjectX" tagNames={["tag1", "tag2"]}
            done={false} later={false} />)

        const descriptionView = screen.getByTestId("description")
        fireEvent.click(descriptionView)

        const itemView = screen.getByTestId("item")
        itemView.blur()//simulate clicking outside

        expect(screen.queryByTestId("edit-description")).not.toBeInTheDocument()
        expect(screen.getByTestId("description")).toBeInTheDocument()
    })
})