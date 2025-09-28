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
        expect(screen.getByRole("checkbox", {name: "Done"})).toBeInTheDocument()
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
        { name: "Project A", later: false, done: false},
        { name: "Project B", later: false, done: true},
        { name: "Project C", later: true, done: false},
        { name: "Project D", later: true, done: true},
    ]
    testCases.forEach(testCase => {
        const { name, later, done } = testCase
        it(`submits item to backend when clicking Create with name = ${name}, later = ${later}, done=${done}`, async () => {
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

            if(done) {
                fireEvent.click(screen.getByRole("checkbox", { name: "Done"}))
                expect(screen.getByRole("checkbox", { name: "Done"})).toBeChecked()
            } else {
                expect(screen.getByRole("checkbox", { name: "Done"})).not.toBeChecked()
            }

            fireEvent.click(screen.getByRole("button", { name: "Create"}))

            expect(client.Projects).toContainEqual({
                id: 0,
                name,
                later,
                done
            })

            await sleep(10)

            expect(onCompleted).toHaveBeenCalled()
        })
    })
})