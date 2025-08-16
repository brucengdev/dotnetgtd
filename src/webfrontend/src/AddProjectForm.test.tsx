import { fireEvent, render, screen } from "@testing-library/react";
import {describe, expect, it, vitest} from 'vitest'
import '@testing-library/jest-dom'
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import AddProjectForm from "./AddProjectForm";

describe("AddProjectForm", () => {
    it("has necessary ui components", () => {
        render(<AddProjectForm client={new TestClient()} onCancel={() => {}}/>)

        expect(screen.getByRole("heading", {name: "New project"})).toBeInTheDocument()
        expect(screen.getByRole("textbox", {name: "Name"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Create"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Cancel"})).toBeInTheDocument()
    })

    it("invokes callback when clicking Cancel", () => {
        const fn = vitest.fn()
        render(<AddProjectForm client={new TestClient()} onCancel={fn} />)

        fireEvent.click(screen.getByRole("button", {name: "Cancel"}))
        expect(fn).toHaveBeenCalled()
    })

    it("submits item to backend when clicking Create", async () => {
        const client = new TestClient()
        const onCompleted = vitest.fn()
        render(<AddProjectForm onCancel={() => {}} client={client} onCompleted={onCompleted} />)

        const nameTextBox = screen.getByRole("textbox", { name: "Name"})
        fireEvent.change(nameTextBox, { target: { value: "name of a project"}})

        expect(nameTextBox).toHaveValue("name of a project")

        fireEvent.click(screen.getByRole("button", { name: "Create"}))

        expect(client.Projects).toContainEqual({
            id: 0,
            name: "name of a project"
        })

        await sleep(10)

        expect(onCompleted).toHaveBeenCalled()
    })
})