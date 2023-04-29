import User, { IUserOutput } from "@models/User";
import { request } from "../helpers";
import userRoutes from "@routes/user.routes";
import { FORBIDDEN, OK } from "http-status";
import { Response } from "supertest";
import { getServer } from "@root/app";

const dbTeardown = async () => {
    await User.sequelize?.query("SET FOREIGN_KEY_CHECKS = 0")
    await User.destroy({ cascade: true, truncate: true, force: true });
    await User.sequelize?.query("SET FOREIGN_KEY_CHECKS = 1")
}

afterAll(done => {
    getServer().closeAllConnections()
    getServer().close()
    done();
})

describe("User resources", () => {
    const URL = '/api/v1/users'

    let tenantId: string
    let user: IUserOutput


    beforeAll(async () => {
        [user] = await Promise.all([
            User.create({ tenantId: crypto.randomUUID(), name: 'Joao', email: 'joao@gmail.com', password: 'password' }),
            User.create({ tenantId: crypto.randomUUID(), name: 'Emanuel', email: 'joao@gmail.com', password: 'password' }),
        ]); ({ tenantId } = user)
    })

    afterAll(async () => {
        await dbTeardown()
    })

    describe("Get all users", () => {
        it("should validate if the response is an array", async () => {
            const response = await request.get(URL).expect(OK)

            expect(Array.isArray(response.body)).toBe(true);
        });

        it("should validate if the response is an array of IUser interface", async () => {
            const response = await request.get(URL).expect(OK)
            const allUser = response.body;
            expect(allUser.length > 0).toEqual(true);
            const user = allUser[0];

            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("email");
            expect(user).toHaveProperty("tenantId");
            expect(user).toHaveProperty("createdAt");
        });
    });

    describe("Get User by TenantId", () => {
        // Verificar se retorna o user do tenantId passado
        // Se o tenant Id for invalido, retornar message usuario n existe
        // Verificar se o retorno é do tipo User

        it("should validate the response is a valid User object", async () => {
            const response = await request.get(`${URL}/${tenantId}`).expect(OK)
            const body = response.body;

            expect(body).toHaveProperty("name");
            expect(body).toHaveProperty("email");
            expect(body).toHaveProperty("tenantId");
            expect(body).toHaveProperty("createdAt");

            expect(body.tenantId).toEqual(tenantId)
            expect(body.name).toEqual(user.name)
            expect(body.email).toEqual(user.email)
        });

        it("should validate the Error response when the tenantId is invalid", async () => {
            const response = await request.get(`${URL}/${tenantId}1`).expect(FORBIDDEN)
            const error = response.body;

            expect(error).toEqual({ message: 'User not found!' })
        });
    })
    describe("Update User", () => {

    })
    describe("Delete User", () => {

    })
    describe("Create User", () => {

    })
});