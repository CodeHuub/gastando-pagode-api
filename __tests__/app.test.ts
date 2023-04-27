import app from "@root/app";
import request from "supertest"

describe("app.ts tests", () => {

    it("should return 4 for 2 + 2 operation", async () => {
        expect(2 + 2).toBe(4);
    });

    it("should return 200 & valid response if request param list is empity", async () => {
        request(app)
            .get('/')
            .expect(200)
            .end((err, res) => {
                expect(res.body).toMatchObject({ message: "Bem-vindo! CodeHub_." })
            })
    });

});