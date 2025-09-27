import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectFilters } from "./ProjectFilters";
import '@testing-library/jest-dom'

describe("ProjectFilters", () => {
    it("has necessary ui components", () => {
        render(<ProjectFilters />)

        expect(screen.getByTestId("project-filters")).toBeInTheDocument()

        expect(screen.getByRole("checkbox", {name: "Active projects"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Inactive projects"})).toBeInTheDocument()

        expect(screen.getByRole("checkbox", {name: "Completed projects"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Uncompleted projects"})).toBeInTheDocument()
    })
})