import { describe, expect, it, vitest } from "vitest"
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { EditableTextView } from "./EditableTextView";

describe("EditableTextView", () => {
    it("changes to textbox when clicked on", () => {
        render(<EditableTextView text="Task A" 
            textViewTestId="textViewTestId" editViewTestId="editViewTestId" />)

        fireEvent.click(screen.getByTestId("textViewTestId"))

        const input = screen.getByTestId("editViewTestId")
        expect(input).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "✓"})).toBeInTheDocument()
        expect(screen.queryByTestId("textViewTestId")).not.toBeInTheDocument()

        expect(input).toHaveValue("Task A")
    })

    it("changes back to text view after clicking accept", () => {
        render(<EditableTextView text="Task A" 
            textViewTestId="textViewTestId" editViewTestId="editViewTestId" />)

        const textView = screen.getByTestId("textViewTestId")
        fireEvent.click(textView)

        fireEvent.click(screen.getByRole("button", { name: "✓"}))

        expect(screen.queryByTestId("editViewTestId")).not.toBeInTheDocument()
        expect(screen.getByTestId("textViewTestId")).toBeInTheDocument()
    })

    it("execute callback if text is changed and accept is clicked", () => {
        const fn = vitest.fn()
        render(<EditableTextView text="Task A" 
            textViewTestId="textViewTestId" editViewTestId="editViewTestId"
            onChange={fn}
        />)

        const textView = screen.getByTestId("textViewTestId")
        fireEvent.click(textView)

        fireEvent.change(screen.getByTestId("editViewTestId"), { target: { value: "Task A Updated" } })

        expect(screen.getByTestId("editViewTestId")).toHaveValue("Task A Updated")

        fireEvent.click(screen.getByRole("button", { name: "✓"}))
        expect(fn).toHaveBeenCalledWith("Task A Updated")
    })
})