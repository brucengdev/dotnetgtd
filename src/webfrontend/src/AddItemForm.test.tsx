import { fireEvent, render, screen } from "@testing-library/react";
import {describe, expect, it, vitest} from 'vitest'
import '@testing-library/jest-dom'
import { AddItemForm } from "./AddItemForm";
import { TestClient } from "./__test__/TestClient";

describe("AddItemForm", () => {
    it("has necessary ui components", () => {
        render(<AddItemForm client={new TestClient()} onCancel={() => {}}/>)

        expect(screen.getByRole("heading", {name: "New item"})).toBeInTheDocument()
        expect(screen.getByRole("textbox", {name: "Description"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Create"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Cancel"})).toBeInTheDocument()
    })

    it("invokes callback when clicking Cancel", () => {
        const fn = vitest.fn()
        render(<AddItemForm client={new TestClient()} onCancel={fn} />)

        fireEvent.click(screen.getByRole("button", {name: "Cancel"}))
        expect(fn).toHaveBeenCalled()
    })

    it("submits item to backend when clicking Create", () => {
        const client = new TestClient()
        const onCompleted = vitest.fn()
        render(<AddItemForm onCancel={() => {}} client={client} onCompleted={onCompleted} />)

        const descriptionTextBox = screen.getByRole("textbox", { name: "Description"})
        fireEvent.change(descriptionTextBox, { target: { value: "description of a task"}})

        expect(descriptionTextBox).toHaveValue("description of a task")

        fireEvent.click(screen.getByRole("button", { name: "Create"}))

        expect(client.Items).toContainEqual({
            description: "description of a task"
        })

        expect(onCompleted).toHaveBeenCalled()
    })
})