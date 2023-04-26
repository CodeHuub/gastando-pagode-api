import request from "supertest";
import app from "../../src/app";

describe("User routes", () => {
    test("Get all users", async () => {
        const res = await request(app).get("/api/v1/users");
        const allUser = res.body
        expect(Array.isArray(allUser)).toBe(true);
        // - Verificar se o objeto é um User
        // - 
        expect(res.body).toEqual(["Goon", "Tsuki", "Joe"]);
    });
});