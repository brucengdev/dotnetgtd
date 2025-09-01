import { screen, render, fireEvent } from "@testing-library/react";
import {describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import { TagView } from "./TagView";
import { TestClient } from "./__test__/TestClient";
import { sleep } from "./__test__/testutils";
import { Tag } from "./models/Tag";

describe("TagView", () => {
    it("has necessary ui components", () => {
        render(<TagView client={new TestClient()} />)

        expect(screen.getByTestId("tag-list")).toBeInTheDocument()
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        expect(addItemButton).toBeInTheDocument()
    })

    const cases = [
        {
            name: "0 Tag",
            expectedTags: [] as Tag[]
        },
        {
            name: "2 Tags",
            expectedTags: [
                { id: 1, name: "Tag 1" },
                { id: 2, name: "Tag 2" }
            ] as Tag[]
        },
        {
            name: "3 Tags",
            expectedTags: [
                { id: 1, name: "Tag A" },
                { id: 2, name: "Tag B" },
                { id: 3, name: "Tag C" }
            ] as Tag[]
        }
    ]
    cases.forEach(({ name, expectedTags}) => {
        it(`shows a list of Tags for ${name}`, async () => {
            const client = new TestClient()
            client.Tags = expectedTags
            render(<TagView client={client} />)
            await sleep(1)

            expect(screen.getByTestId("tag-list")).toBeInTheDocument()
            
            const Tags = screen.queryAllByTestId("tag")
            expect(Tags.length).toBe(expectedTags.length)

            for(let i = 0; i < expectedTags.length; i++) {
                expect(Tags[i].querySelector('[data-testid="name"]')?.textContent).toBe(expectedTags[i].name)
            }
        })
    })

    it("shows add Tag form when button Add is clicked", () => {
        render(<TagView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        expect(screen.getByTestId("add-tag-form")).toBeInTheDocument()

        expect(addItemButton).not.toBeInTheDocument()

    })

    it("hides add Tag form when Cancel button is clicked", async () => {
        render(<TagView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        expect(screen.getByTestId("add-tag-form")).toBeInTheDocument()
        expect(addItemButton).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", { name: "Cancel"}))

        expect(screen.queryByTestId("add-tag-form")).not.toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Add"})).toBeInTheDocument()
    })

    it("hides add Tag form when Create button is clicked", async () => {
        render(<TagView client={new TestClient()} />)
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        fireEvent.change(screen.getByRole("textbox", { name: "Name"}), { target: { value: "New Tag 1" } })
        fireEvent.click(screen.getByRole("button", { name: "Create"}))

        await sleep(10)

        expect(screen.queryByTestId("add-tag-form")).not.toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Add"})).toBeInTheDocument()
    })

    it("adds a new Tag when Create button is clicked", async () => {
        const client = new TestClient()
        client.Tags = [
            {id: 1, name: "Tag X" }
        ]
        render(<TagView client={client} />)

        await sleep(1)

        let Tags = screen.queryAllByTestId("tag")
        expect(Tags.length).toBe(1)
        expect(Tags[0].querySelector('[data-testid="name"]')?.textContent).toBe("Tag X")
        
        const addItemButton = screen.getByRole("button", { name: "Add"})
        fireEvent.click(addItemButton)

        fireEvent.change(screen.getByRole("textbox", { name: "Name"}), { target: { value: "Tag Y" } })
        fireEvent.click(screen.getByRole("button", { name: "Create"}))

        await sleep(1)

        Tags = screen.queryAllByTestId("tag")
        expect(Tags.length).toBe(2)

        expect(Tags[0].querySelector('[data-testid="name"]')?.textContent).toBe("Tag X")
        expect(Tags[1].querySelector('[data-testid="name"]')?.textContent).toBe("Tag Y")
    })

    it("deletes a Tag when delete is clicked and confirmed", async () => {
        const client = new TestClient()
        client.Tags = [
            {id: 1, name: "Tag X" },
            {id: 2, name: "Tag Y" },
            {id: 3, name: "Tag Z" }
        ]
        render(<TagView client={client} />)

        await sleep(1)

        const deleteTagButtons = screen.getAllByRole("button", {name: "Delete"})
        const TagYDeleteButton = deleteTagButtons[1]
        fireEvent.click(TagYDeleteButton)

        fireEvent.click(screen.getByRole("button", {name: "Yes"}))

        await sleep(1)

        const Tags = screen.getAllByTestId("tag")
        expect(Tags.length).toBe(2)

        expect(Tags[0].querySelector('[data-testid="name"]')?.textContent).toBe("Tag X")
        expect(Tags[1].querySelector('[data-testid="name"]')?.textContent).toBe("Tag Z")
    })
})