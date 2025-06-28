import { render } from "@testing-library/react";
import {describe, it} from 'vitest'
import '@testing-library/jest-dom'
import { AddItemForm } from "./AddItemForm";

describe("AddItemForm", () => {
    it("has necessary ui components", () => {
        render(<AddItemForm />)
    })
})