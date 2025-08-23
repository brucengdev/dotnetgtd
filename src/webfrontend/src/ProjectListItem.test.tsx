import { describe, expect, it } from "vitest";
import { ProjectListItem } from "./ProjectListItem";
import { render, screen } from "@testing-library/react";

describe("ProjectListItem", () => {
    it("shows the name", () => {
        render(<ProjectListItem name="Test Project" />);

        expect(screen.getByTestId("name").textContent).toBe("Test Project")
    })
});