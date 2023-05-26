import supertest from "supertest";
import app from "../../../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Customer } from "../../../models/Customer.model";
import * as customerCreateMock from "../../mocks/index";

describe("POST /login", () => {
  const baseUrl: string = "/login";
  const baseUrlRefresh: string = baseUrl + "/token";
  const baseUrlLogout: string = "/logout";

  let request: supertest.SuperTest<supertest.Test>;
  let server: MongoMemoryServer;

  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    const uri = server.getUri();
    await mongoose.connect(uri, { autoIndex: true });
    request = supertest(app);
  });

  beforeEach(async () => {
    await Customer.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.stop();
  });

  it("Success: Must be able to login", async () => {
    await Customer.create({
      ...customerCreateMock.default.customerLoginMock.customerActivate,
      emails:
        customerCreateMock.default.customerLoginMock.customerActivate.email,
      telephones:
        customerCreateMock.default.customerLoginMock.customerActivate.telephone,
    });

    const response = await request.post(baseUrl).send({
      email:
        customerCreateMock.default.customerLoginMock.customerActivate.email,
      password:
        customerCreateMock.default.customerLoginMock.customerActivate.password,
    });

    const expectResults = {
      status: 200,
      bodyEqual: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Success: Must be able to refresh customer token", async () => {
    await Customer.create({
      ...customerCreateMock.default.customerLoginMock.customerActivate,
      emails:
        customerCreateMock.default.customerLoginMock.customerActivate.email,
      telephones:
        customerCreateMock.default.customerLoginMock.customerActivate.telephone,
    });

    const login = await request.post(baseUrl).send({
      email:
        customerCreateMock.default.customerLoginMock.customerActivate.email,
      password:
        customerCreateMock.default.customerLoginMock.customerActivate.password,
    });

    const response = await request.post(
      `${baseUrlRefresh}?refreshToken=${login.body.refreshToken}`
    );

    const expectResults = {
      status: 200,
      bodyEqual: {
        message: "Access token successfully renewed!",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Success: Must be able to logout customer", async () => {
    await Customer.create({
      ...customerCreateMock.default.customerLoginMock.customerActivate,
      emails:
        customerCreateMock.default.customerLoginMock.customerActivate.email,
      telephones:
        customerCreateMock.default.customerLoginMock.customerActivate.telephone,
    });

    const login = await request.post(baseUrl).send({
      email:
        customerCreateMock.default.customerLoginMock.customerActivate.email,
      password:
        customerCreateMock.default.customerLoginMock.customerActivate.password,
    });

    const response = await request
      .post(`${baseUrlLogout}?accessToken=${login.body.accessToken}`)
      .set("Authorization", `Bearer ${login.body.accessToken}`);

    const expectResults = {
      status: 200,
      bodyEqual: {
        message: "Successfully logged out!",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to login - Invalid credential 1 - Wrong password", async () => {
    await Customer.create({
      ...customerCreateMock.default.customerLoginMock.customerActivate,
      emails:
        customerCreateMock.default.customerLoginMock.customerActivate.email,
      telephones:
        customerCreateMock.default.customerLoginMock.customerActivate.telephone,
    });

    const response = await request.post(baseUrl).send({
      email:
        customerCreateMock.default.customerLoginMock.customerInvalidCredential1
          .email,
      password:
        customerCreateMock.default.customerLoginMock.customerInvalidCredential1
          .password,
    });

    const expectResults = {
      status: 401,
      bodyEqual: { message: "Incorrect password" },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to login - Invalid credential 2 - Wrong email", async () => {
    await Customer.create({
      ...customerCreateMock.default.customerLoginMock.customerActivate,
      emails:
        customerCreateMock.default.customerLoginMock.customerActivate.email,
      telephones:
        customerCreateMock.default.customerLoginMock.customerActivate.telephone,
    });

    const response = await request.post(baseUrl).send({
      email:
        customerCreateMock.default.customerLoginMock.customerInvalidCredential2
          .email,
      password:
        customerCreateMock.default.customerLoginMock.customerInvalidCredential2
          .password,
    });

    const expectResults = {
      status: 401,
      bodyEqual: {
        message: "Email not registered, please register a new email!",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to refresh token - Invalid token", async () => {
    await Customer.create({
      ...customerCreateMock.default.customerLoginMock.customerActivate,
      emails:
        customerCreateMock.default.customerLoginMock.customerActivate.email,
      telephones:
        customerCreateMock.default.customerLoginMock.customerActivate.telephone,
    });

    const login = await request.post(baseUrl).send({
      email:
        customerCreateMock.default.customerLoginMock.customerActivate.email,
      password:
        customerCreateMock.default.customerLoginMock.customerActivate.password,
    });

    const invalidToken = login.body.refreshToken.slice(0, -1) + "X";

    const response = await request
      .post(baseUrlRefresh)
      .query({ refreshToken: invalidToken });

    const expectResults = {
      status: 401,
      bodyEqual: { message: "invalid signature" },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });
});
