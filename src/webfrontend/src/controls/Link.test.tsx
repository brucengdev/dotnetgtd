import { describe, expect, it, vitest } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Link } from "./Link";

describe("Link control", () => {
    it("shows link with text", () => {
        render(<Link text="Test Link" />)
        expect(screen.getByRole("link")).toHaveTextContent("Test Link")
    })

    it("executes callback when link is clicked", () => {
        const fn = vitest.fn()
        render(<Link text="Test Link" onClick={fn} />)
        
        fireEvent.click(screen.getByRole("link"))
        expect(fn).toHaveBeenCalled()
    })
})