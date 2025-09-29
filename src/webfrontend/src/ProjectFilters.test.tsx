import { render, screen } from "@testing-library/react";
import { describe, expect, it, vitest } from "vitest";
import { ProjectFilters } from "./ProjectFilters";
import '@testing-library/jest-dom'

describe("ProjectFilters", () => {
    it("has necessary ui components and use default filter", () => {
        render(<ProjectFilters />)

        expect(screen.getByTestId("project-filters")).toBeInTheDocument()

        expect(screen.getByRole("checkbox", {name: "Active projects"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Active projects"})).toBeChecked()
        expect(screen.getByRole("checkbox", {name: "Inactive projects"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Inactive projects"})).not.toBeChecked()

        expect(screen.getByRole("checkbox", {name: "Completed projects"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Completed projects"})).not.toBeChecked()
        expect(screen.getByRole("checkbox", {name: "Uncompleted projects"})).toBeInTheDocument()
        expect(screen.getByRole("checkbox", {name: "Uncompleted projects"})).toBeChecked()
    })

    it("active filter is checked", () => {
        const fn = vitest.fn()
        const filter = {}
        render(<ProjectFilters filter={filter} onChange={fn} />)

        screen.getByRole("checkbox", {name: "Active projects"}).click()

        expect(fn).toHaveBeenCalledWith({ active: true })
    })

    it("active filter is unchecked", () => {
        const fn = vitest.fn()
        const filter = { active: true }
        render(<ProjectFilters filter={filter} onChange={fn} />)

        screen.getByRole("checkbox", {name: "Active projects"}).click()

        expect(fn).toHaveBeenCalledWith({ active: false })
    })
})