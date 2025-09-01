import { fireEvent, render, screen } from "@testing-library/react";
import {describe, expect, it, vitest} from 'vitest'
import '@testing-library/jest-dom'
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import AddTagForm from "./AddTagForm";

describe("AddTagForm", () => {
    it("has necessary ui components", () => {
        render(<AddTagForm client={new TestClient()} onCancel={() => {}}/>)

        expect(screen.getByRole("heading", {name: "New tag"})).toBeInTheDocument()
        expect(screen.getByRole("textbox", {name: "Name"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Create"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Cancel"})).toBeInTheDocument()
    })

    it("invokes callback when clicking Cancel", () => {
        const fn = vitest.fn()
        render(<AddTagForm client={new TestClient()} onCancel={fn} />)

        fireEvent.click(screen.getByRole("button", {name: "Cancel"}))
        expect(fn).toHaveBeenCalled()
    })

    it("submits item to backend when clicking Create", async () => {
        const client = new TestClient()
        const onCompleted = vitest.fn()
        render(<AddTagForm onCancel={() => {}} client={client} onCompleted={onCompleted} />)

        const nameTextBox = screen.getByRole("textbox", { name: "Name"})
        fireEvent.change(nameTextBox, { target: { value: "name of a Tag"}})

        expect(nameTextBox).toHaveValue("name of a Tag")

        fireEvent.click(screen.getByRole("button", { name: "Create"}))

        expect(client.Tags).toContainEqual({
            id: 0,
            name: "name of a Tag"
        })

        await sleep(10)

        expect(onCompleted).toHaveBeenCalled()
    })
})