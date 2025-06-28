import { fireEvent, render, screen } from "@testing-library/react";
import {describe, expect, it, vitest} from 'vitest'
import '@testing-library/jest-dom'
import { AddItemForm } from "./AddItemForm";

describe("AddItemForm", () => {
    it("has necessary ui components", () => {
        render(<AddItemForm onCancel={() => {}}/>)

        expect(screen.getByRole("heading", {name: "New item"})).toBeInTheDocument()
        expect(screen.getByRole("textbox", {name: "Description"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Create"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Cancel"})).toBeInTheDocument()
    })

    it("invokes callback when clicking Cancel", () => {
        const fn = vitest.fn()
        render(<AddItemForm onCancel={fn} />)

        fireEvent.click(screen.getByRole("button", {name: "Cancel"}))
        expect(fn).toHaveBeenCalled()
    })
})