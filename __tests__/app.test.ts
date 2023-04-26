import app from "../src/app"
import request from "supertest"

describe("app.ts tests", () => {
    test("Jest is up", async () => {
        await new Promise((r) => setTimeout(r, 100));
        expect(2 + 2).toBe(4);
    });

    test("Server is up", async () => {
        const res = await request(app).get("/");
        expect(res.body).toEqual({ message: "Bem-vindo! CodeHub_." });
    });

});