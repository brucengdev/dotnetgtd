import { describe, expect, it, vitest } from "vitest";
import { ProjectListItem } from "./ProjectListItem";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { sleep } from "./__test__/testutils";

describe("ProjectListItem", () => {
    it("executes callback to update project after name is changed", async () => {
        const fn = vitest.fn()
        render(<ProjectListItem 
            project={{ id: 0, name: "Test Project", later: false, done: false }}
            onChange={fn}
        />)

        screen.getByTestId("name").click()
        await sleep(1)

        expect(screen.getByTestId("edit-name")).toBeInTheDocument()
        expect(screen.queryByTestId("name")).not.toBeInTheDocument()

        fireEvent.change(screen.getByTestId("edit-name"), { target: { value: "Updated Project" } })
        expect(screen.getByTestId("edit-name")).toHaveValue("Updated Project")

        fireEvent.click(screen.getByRole("button", { name: "✓" }))

        expect(fn).toHaveBeenCalledWith({
            id: 0,
            name: "Updated Project",
            done: false,
            later: false
        })
    })
})