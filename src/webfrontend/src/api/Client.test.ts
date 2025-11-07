import { describe, expect, it, vitest } from "vitest";
import { Client } from "./Client";

describe("Client.GetItems", () => {
    it("use * for completion filter if both completed and uncompleted are true", async () => {
        const foo = vitest.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }));
        const client = new Client()

        client.GetItems({
            completed: true,
            uncompleted: true
        })

        expect(foo).toHaveBeenCalledWith(expect.stringContaining("complete=*"), expect.any(Object));
        vitest.restoreAllMocks
    })
})


describe("Client.GetProjects", () => {
    it("use * for completion filter if both completed and uncompleted are true", async () => {
        const foo = vitest.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }));
        const client = new Client()

        client.GetProjects({
            completed: true,
            uncompleted: true
        })

        expect(foo).toHaveBeenCalledWith(expect.stringContaining("complete=*"), expect.any(Object));
        vitest.restoreAllMocks
    })
})