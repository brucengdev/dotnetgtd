import { describe, expect, it, vitest } from "vitest";
import { ProjectListItem } from "./ProjectListItem";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { sleep } from "./__test__/testutils"

describe("ProjectListItem", () => {
    const updateNameCases = [
        { initialName: "Test Project", newName: "Updated Project" },
        { initialName: "A", newName: "B" }
    ]
    updateNameCases.forEach(({ initialName, newName }) => {
        it(`executes callback to update project after name is changed from \`${initialName}\` to \`${newName}\``, async () => {
            const fn = vitest.fn()
            render(<ProjectListItem 
                project={{ id: 1, name: initialName, later: false, done: false }}
                onChange={fn}
            />)

            screen.getByTestId("name").click()
            await sleep(1)

            expect(screen.getByTestId("edit-name")).toBeInTheDocument()
            expect(screen.queryByTestId("name")).not.toBeInTheDocument()

            fireEvent.change(screen.getByTestId("edit-name"), { target: { value: newName } })
            expect(screen.getByTestId("edit-name")).toHaveValue(newName)

            fireEvent.click(screen.getByRole("button", { name: "✓" }))

            expect(fn).toHaveBeenCalledWith({
                id: 1,
                name: newName,
                done: false,
                later: false
            })
        })
    })

    const updateLaterCases = [true, false]
    updateLaterCases.forEach(later => {
        it(`executes callback to update project after later is changed to ${later}`, async () => {
            const fn = vitest.fn()
            render(<ProjectListItem 
                project={{ id: 1, name: "Test Project", later: !later, done: false }}
                onChange={fn} />)

            const laterCheckbox = screen.getByTestId("later")
            laterCheckbox.click()

            expect(fn).toHaveBeenCalledWith({
                id: 1,
                name: "Test Project",
                later: later,
                done: false
            })
        })
    })
})