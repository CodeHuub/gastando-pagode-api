import User, { IUserOutput } from "@models/User";
import { request } from "../helpers";
import { BAD_REQUEST, NOT_FOUND, NO_CONTENT, OK } from "http-status";
import { getServer } from "@root/app";

const dbTeardown = async () => {
  await User.sequelize?.query("SET FOREIGN_KEY_CHECKS = 0");
  await User.destroy({ cascade: true, truncate: true, force: true });
  await User.sequelize?.query("SET FOREIGN_KEY_CHECKS = 1");
};

afterAll((done) => {
  getServer().closeAllConnections();
  getServer().close();
  done();
});

describe("User resources", () => {
  const URL = "/api/v1/users";
  let tenantId: string;
  let user: IUserOutput;

  beforeAll(async () => {
    [user] = await Promise.all([
      User.create({
        tenantId: crypto.randomUUID(),
        name: "Joao",
        email: "joao@gmail.com",
        password: "password",
      }),
      User.create({
        tenantId: crypto.randomUUID(),
        name: "Emanuel",
        email: "emanuel@gmail.com",
        password: "password",
      }),
    ]);
    ({ tenantId } = user);
  });

  afterAll(async () => {
    await dbTeardown();
  });

  describe("Get all users", () => {
    it("should validate if the response is an array", async () => {
      const response = await request.get(URL).expect(OK);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should validate if the response is an array of IUser interface", async () => {
      const response = await request.get(URL).expect(OK);
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
    it("should validate the response is a valid User object", async () => {
      const response = await request.get(`${URL}/${tenantId}`).expect(OK);
      const body = response.body;

      expect(body).toHaveProperty("name");
      expect(body).toHaveProperty("email");
      expect(body).toHaveProperty("tenantId");
      expect(body).toHaveProperty("createdAt");

      expect(body.tenantId).toEqual(tenantId);
      expect(body.name).toEqual(user.name);
      expect(body.email).toEqual(user.email);
    });

    it("should validate the Error response when the tenantId is invalid", async () => {
      const response = await request
        .get(`${URL}/${tenantId}1`)
        .expect(NOT_FOUND);
      const error = response.body;

      expect(error).toEqual({ message: "User not found!" });
    });
  });

  describe("Update User", () => {
    it("should validate invalid TenantId scenario", async () => {
      const { body: user } = await request.get(`${URL}/${tenantId}`);
      user.name = "Diana";

      const response = await request
        .put(`${URL}/${tenantId}1`)
        .send(user)
        .expect(NOT_FOUND);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "User not found!" });
    });

    it("should validate if the data was updated", async () => {
      let { body: user } = await request.get(`${URL}/${tenantId}`);
      user.email = "emanuel@codehuub.com";
      user.password = "2134";

      const response = await request
        .put(`${URL}/${tenantId}`)
        .send(user)
        .expect(OK);

      delete user.password;
      const currentUser = response.body;
      expect(currentUser).toMatchObject(user);

      const getUserResponse = await request.get(`${URL}/${tenantId}`);
      user = getUserResponse.body;
      expect(user).toMatchObject(currentUser);
    });

    it("should validate empty Name scenario", async () => {
      const { body: user } = await request.get(`${URL}/${tenantId}`);
      user.name = "";

      const response = await request
        .put(`${URL}/${tenantId}`)
        .send(user)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "Name property is empty" });
    });

    it("should validate empty E-mail scenario", async () => {
      const { body: user } = await request.get(`${URL}/${tenantId}`);
      user.email = "";

      const response = await request
        .put(`${URL}/${tenantId}`)
        .send(user)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "E-mail property is empty" });
    });

    it("should validate invalid E-mail scenario", async () => {
      const { body: user } = await request.get(`${URL}/${tenantId}`);
      user.email = "test";

      const response = await request
        .put(`${URL}/${tenantId}`)
        .send(user)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({
        errorMessage: "E-mail is invalid, E.g test@test.com",
      });
    });

    it("should validate empty Password scenario", async () => {
      const { body: user } = await request.get(`${URL}/${tenantId}`);
      user.password = "";

      const response = await request
        .put(`${URL}/${tenantId}`)
        .send(user)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "Password property is empty" });
    });

    it("should validate invalid Password scenario", async () => {
      const { body: user } = await request.get(`${URL}/${tenantId}`);
      user.password = "123456🤡";

      const response = await request
        .put(`${URL}/${tenantId}`)
        .send(user)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "Password is invalid!" });
    });

    it("should validate if E-mail already exists scenario", async () => {
      const { body: userList } = await request.get(`${URL}/`);
      const user = userList[0];
      user.email = userList[1].email;

      const response = await request
        .put(`${URL}/${tenantId}`)
        .send(user)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "E-mail already exists!" });
    });

    it("should validate if Password is the same scenario", async () => {
      const { body: user } = await request.get(`${URL}/${tenantId}`);
      user.password = "password";

      const response = await request
        .put(`${URL}/${tenantId}`)
        .send(user)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({
        errorMessage: "Password is the same as the current one!",
      });
    });
  });

  describe("Delete User", () => {

    it("should validate invalid TenantId scenario", async () => {

      const response = await request
        .delete(`${URL}/${tenantId}1`)
        .expect(NOT_FOUND);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "User not found!" });
    });

    it("should validate if the data was delete", async () => {

      const response = await request
        .delete(`${URL}/${tenantId}`)
        .expect(NO_CONTENT);

      const currentUser = response.body;
      expect(currentUser).toEqual(null);

      const { body: error } = await request.get(`${URL}/${tenantId}`);

      expect(error).toEqual({ errorMessage: "User not found!" });
    });
  });

  describe("Create User", () => {

    let userToCreate = {
      name: "Joao",
      email: "joao1@gmail.com",
      password: "password",
      tenantId: ''
    }
    beforeEach(async () => {
      userToCreate = {
        name: "Joao",
        email: "joao1@gmail.com",
        password: "password",
        tenantId: ''
      }
    });

    it("should validate if the data was created", async () => {

      const response = await request
        .post(`${URL}`)
        .send(userToCreate)
        .expect(OK);

      const user = response.body;

      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("tenantId");
      expect(user).toHaveProperty("createdAt");

      userToCreate.tenantId = user.tenantId
      expect(user).toMatchObject(userToCreate);

      const { body: userCreated } = await request.get(`${URL}/${user.tenantId}`);
      expect(user).toMatchObject(userCreated);
    });

    it("should validate empty Name scenario", async () => {
      userToCreate.name = ''

      const response = await request
        .post(`${URL}`)
        .send(userToCreate)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "Name property is empty" });
    });

    it("should validate empty E-mail scenario", async () => {
      userToCreate.email = ''
      const response = await request
        .post(`${URL}`)
        .send(userToCreate)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "E-mail property is empty" });
    });

    it("should validate invalid E-mail scenario", async () => {
      userToCreate.email = "123456🤡";
      const response = await request
        .post(`${URL}`)
        .send(userToCreate)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({
        errorMessage: "E-mail is invalid, E.g test@test.com",
      });
    });

    it("should validate empty Password scenario", async () => {
      userToCreate.password = ''
      const response = await request
        .post(`${URL}`)
        .send(userToCreate)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "Password property is empty" });
    });

    it("should validate invalid Password scenario", async () => {
      userToCreate.password = "123456🤡";

      const response = await request
        .post(`${URL}`)
        .send(userToCreate)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "Password is invalid!" });
    });

    it("should validate if E-mail already exists scenario", async () => {
      userToCreate.email = "joao@gmail.com";

      const response = await request
        .post(`${URL}`)
        .send(userToCreate)
        .expect(BAD_REQUEST);

      const error = response.body;

      expect(error).toEqual({ errorMessage: "E-mail already exists!" });
    });
  });
});
