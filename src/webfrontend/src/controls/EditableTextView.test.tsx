import { describe, expect, it } from "vitest";
import { EditableTextView } from "./EditableTextView";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'

describe("EditableTextView", () => {
    it("is a text field initially", () => {
        render(<EditableTextView text="foo" dataTestId="testfield" />)

        expect(screen.getByTestId("testfield")).toBeInTheDocument()
    })
})