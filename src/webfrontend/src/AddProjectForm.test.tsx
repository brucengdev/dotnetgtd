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
        expect(screen.getByRole("checkbox", {name: "Later"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Create"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Cancel"})).toBeInTheDocument()
    })

    it("invokes callback when clicking Cancel", () => {
        const fn = vitest.fn()
        render(<AddProjectForm client={new TestClient()} onCancel={fn} />)

        fireEvent.click(screen.getByRole("button", {name: "Cancel"}))
        expect(fn).toHaveBeenCalled()
    })

    const testCases = [
        {
            name: "Project A",
            later: true
        },
        {
            name: "Project B",
            later: false
        }
    ]
    testCases.forEach(testCase => {
        const { name, later } = testCase
        it(`submits item to backend when clicking Create with name = ${name} and later = ${later}`, async () => {
            const client = new TestClient()
            const onCompleted = vitest.fn()
            render(<AddProjectForm onCancel={() => {}} client={client} onCompleted={onCompleted} />)

            const nameTextBox = screen.getByRole("textbox", { name: "Name"})
            fireEvent.change(nameTextBox, { target: { value: name}})

            expect(nameTextBox).toHaveValue(name)

            if(later) {
                fireEvent.click(screen.getByRole("checkbox", { name: "Later"}))
                expect(screen.getByRole("checkbox", { name: "Later"})).toBeChecked()
            } else {
                expect(screen.getByRole("checkbox", { name: "Later"})).not.toBeChecked()
            }

            fireEvent.click(screen.getByRole("button", { name: "Create"}))

            expect(client.Projects).toContainEqual({
                id: 0,
                name,
                later
            })

            await sleep(10)

            expect(onCompleted).toHaveBeenCalled()
        })
    })
})