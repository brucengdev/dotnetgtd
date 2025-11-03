import { describe, expect, it } from "vitest"
import ItemView from "./ItemView"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Project } from "./models/Project";
import { Tag } from "./models/Tag";

const testProjects: Project[] = [
    { id: 1, name: "Uncompleted Active Project", done: false, later: false },
    { id: 2, name: "Completed Active Project", done: true, later: false },
    { id: 3, name: "Uncompleted Inactive Project", done: false, later: true },
    { id: 4, name: "Completed Inactive Project", done: true, later: true }
];

const testTags: Tag[] = [
    { id: 1, name: "tag1" },
    { id: 2, name: "tag2" }
]


describe("ItemView", () => {
    const smallScreenSize = [
        320, 375, 425, 576, 640
    ]
    smallScreenSize.forEach(size => {
        it(`shows compact view on mobile screens with size = ${size}`, () => {
            const originalSize = window.innerWidth
            window.innerWidth = size
            render(<ItemView item={{
                id: 1,
                description: "test task",
                done: false,
                later: false
            }} 
            projects={testProjects} 
            tags={testTags}
            />)

            expect(screen.getByTestId("description")).toBeInTheDocument()
            expect(screen.queryByTestId("project")).not.toBeInTheDocument()
            expect(screen.queryByTestId("done")).not.toBeInTheDocument()
            expect(screen.queryByTestId("later")).not.toBeInTheDocument()
            expect(screen.queryByTestId("tags")).not.toBeInTheDocument()

            expect(screen.getByRole("link", { name: "more"})).toBeInTheDocument()
            expect(screen.queryByRole("link", { name: "collapse"})).not.toBeInTheDocument()

            window.innerWidth = originalSize
        })
    })

    const bigScreenSize = [
        641, 768, 1024, 1280, 1536
    ]
    bigScreenSize.forEach(size => {
        it(`shows full view on mobile screens with size = ${size}`, () => {
            const originalSize = window.innerWidth
            window.innerWidth = size
            render(<ItemView item={{
                id: 1,
                description: "test task",
                done: false,
                later: false
            }} 
            projects={testProjects} 
            tags={testTags}
            />)

            expect(screen.getByTestId("description")).toBeInTheDocument()
            expect(screen.getByTestId("project")).toBeInTheDocument()
            expect(screen.getByTestId("done")).toBeInTheDocument()
            expect(screen.getByTestId("later")).toBeInTheDocument()
            expect(screen.getByTestId("tags")).toBeInTheDocument()

            expect(screen.queryByRole("link", { name: "more"})).not.toBeInTheDocument()
            expect(screen.getByRole("link", { name: "collapse"})).toBeInTheDocument()

            window.innerWidth = originalSize
        })
    })

    it(`expands compact view when more is clicked on`, () => {
        const originalSize = window.innerWidth
        window.innerWidth = 640
        render(<ItemView item={{
            id: 1,
            description: "test task",
            done: false,
            later: false
        }} 
        projects={testProjects} 
        tags={testTags}
        />)

        expect(screen.getByTestId("description")).toBeInTheDocument()
        expect(screen.queryByTestId("project")).not.toBeInTheDocument()
        expect(screen.queryByTestId("done")).not.toBeInTheDocument()
        expect(screen.queryByTestId("later")).not.toBeInTheDocument()
        expect(screen.queryByTestId("tags")).not.toBeInTheDocument()

        expect(screen.getByRole("link", { name: "more"})).toBeInTheDocument()
        expect(screen.queryByRole("link", { name: "collapse"})).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole("link", { name: "more"}))

        expect(screen.getByTestId("description")).toBeInTheDocument()
        expect(screen.getByTestId("project")).toBeInTheDocument()
        expect(screen.getByTestId("done")).toBeInTheDocument()
        expect(screen.getByTestId("later")).toBeInTheDocument()
        expect(screen.getByTestId("tags")).toBeInTheDocument()

        expect(screen.queryByRole("link", { name: "more"})).not.toBeInTheDocument()
        expect(screen.getByRole("link", { name: "collapse"})).toBeInTheDocument()

        window.innerWidth = originalSize
    })
})