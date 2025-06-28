import { render, screen } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { AddItemForm } from "./AddItemForm";

describe("AddItemForm", () => {
    it("has necessary ui components", () => {
        render(<AddItemForm />)

        expect(screen.getByRole("heading", {name: "New item"})).toBeInTheDocument()
    })
})