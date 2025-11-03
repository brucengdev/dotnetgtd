import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Link } from "./Link";

describe("Link control", () => {
    it("shows link with text", () => {
        render(<Link text="Test Link" />)
        expect(screen.getByRole("link")).toHaveTextContent("Test Link")
    })
})