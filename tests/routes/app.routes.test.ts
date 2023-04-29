import { request } from "../helpers";
import { getServer } from "@root/app";

describe("app.ts tests", () => {

    beforeAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
    })

    afterAll(done => {
        getServer().closeAllConnections()
        getServer().close()
        done();
    })

    it("should return 4 for 2 + 2 operation", async () => {
        expect(2 + 2).toBe(4);
    });

    it("should return 200 & valid response if request param list is not empity", async () => {
        const response = await request.get('/').expect(200);
        expect(response.body).toEqual({ message: "Bem-vindo! CodeHub_." })

    });

});