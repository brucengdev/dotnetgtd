import { describe, expect, it, vitest } from "vitest"
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
        320, 375, 425, 576, 639
    ]
    smallScreenSize.forEach(size => {
        it(`shows compact view on mobile screens with size = ${size}`, () => {
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
            expect(screen.getByTestId("project")).not.toBeInTheDocument()
            expect(screen.getByTestId("done")).not.toBeInTheDocument()
            expect(screen.getByTestId("later")).not.toBeInTheDocument()
            expect(screen.getByTestId("tags")).not.toBeInTheDocument()
        })
    })
})