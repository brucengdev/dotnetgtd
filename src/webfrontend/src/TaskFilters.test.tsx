import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskFilters } from "./TaskFilters";
import { TestClient } from "./__test__/TestClient";
import '@testing-library/jest-dom'

describe("TaskFilters views", () => {
    it("shows tag and project filters", () => {
        const client = new TestClient()
        render(<TaskFilters client={client} />)

        expect(screen.getByRole("link", {name: "No project"})).toBeInTheDocument()
        expect(screen.getByRole("link", {name: "No tag"})).toBeInTheDocument()
    })
})