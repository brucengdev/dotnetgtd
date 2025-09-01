import { describe, expect, it, vitest } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { TagList } from "./TagList";

describe("TagList", () => {
    it("shows the list of tags", () => {
        const tags = [
            { id: 1, name: "Tag A" },
            { id: 2, name: "Tag B" }
        ]
        render(<TagList tags={tags} />)
        
        const tagItems = screen.getAllByTestId("tag")
        expect(tagItems.length).toBe(2)

        const tagA = tagItems[0]
        expect(tagA.querySelector("[data-testId='name']")?.textContent)
            .toBe('Tag A')

        const tagB = tagItems[1]
        expect(tagB.querySelector("[data-testId='name']")?.textContent)
            .toBe('Tag B')
    })

    it("calls onDelete when a tag is deleted", () => {
        const tags = [
            { id: 1, name: "Tag A" },
            { id: 2, name: "Tag B" }
        ]
        const onDelete = vitest.fn()
        render(<TagList tags={tags} onDelete={onDelete} />)

        const deleteTagButtons = screen.getAllByRole("button", {name: "Delete"})
        const tagYDeleteButton = deleteTagButtons[1]
        fireEvent.click(tagYDeleteButton)
        
        fireEvent.click(screen.getByRole("button", {name: "Yes"}))
        expect(onDelete).toHaveBeenCalledWith(2)
    })
});