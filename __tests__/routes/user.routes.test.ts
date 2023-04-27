import request, { Response } from "supertest";
import userRoutes from "@routes/user.routes";
import { OK } from "http-status";

describe("User routes", () => {
    describe("Get all users", () => {
        it("should validate if the response is an array", async () => {
            request(userRoutes)
                .get('/')
                .expect(OK)
                .end((err, res: Response) => {
                    expect(Array.isArray(res.body)).toBe(true);
                })
        });

        it("should validate if the response is an array of IUser interface", async () => {
            request(userRoutes)
                .get('/')
                .expect(OK)
                .end((err, res: Response) => {
                    const allUser = res.body;
                    expect(allUser.length > 0).toEqual(true);
                    const user = allUser[0];
                    expect(user).toHaveProperty("name");
                    expect(user).toHaveProperty("email");
                    expect(user).toHaveProperty("tenantId");
                })
        });
    });
});