import { describe, expect, it, vitest } from "vitest";
import { ProjectListItem } from "./ProjectListItem";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { sleep } from "./__test__/testutils";

describe("ProjectListItem", () => {
    it("executes callback to update project after name is changed", async () => {
        render(<ProjectListItem name="Test Project" later={false} done={false} />)

        screen.getByTestId("name").click()
        await sleep(1)

        expect(screen.getByTestId("edit-name")).toBeInTheDocument()
    })
})