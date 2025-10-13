import { describe, expect, it, vitest } from "vitest";
import { TagListItem } from "./TagListItem";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { sleep } from "./__test__/testutils";

describe("TagListItem", () => {
    it("executes callback when changing name", async () => {
        const onChange = vitest.fn()
        render(<TagListItem tag={{id: 1, name: "Test Tag", userId: 1 }} 
            onChange={onChange} />)

        screen.getByTestId("name").click()
        await sleep(1)

        fireEvent.change(screen.getByTestId("edit-name"), 
            { target: { value: "Updated Tag" } })
        
        expect(screen.getByTestId("edit-name")).toHaveValue("Updated Tag")
        fireEvent.click(screen.getByRole("button", { name: "✓"}))

        expect(onChange)
            .toHaveBeenCalledWith({id: 1, name: "Updated Tag", userId: 1 })
    })
});