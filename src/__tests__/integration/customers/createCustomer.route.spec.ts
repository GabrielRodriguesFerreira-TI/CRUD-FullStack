import supertest from "supertest";
import app from "../../../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Customer } from "../../../models/Customer.model";
import * as customerCreateMock from "../../mocks/index";

describe("POST /customers", () => {
  const baseUrl: string = "/customers";
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

  it("Success: Must be able to create a customer - Full body", async () => {
    const response = await request
      .post(baseUrl)
      .send(customerCreateMock.default.customersCreateMock.customerComplete);

    const expectBody = {
      ...customerCreateMock.default.customersCreateMock.customerReturnComplete,
    };

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(expectBody));
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );
    expect(response.body.createdAt).toEqual(
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    );
    expect(response.body.updatedAt).toEqual(
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    );
  });

  it("Error: Must not be able to create a customer - Email already exists", async () => {
    await Customer.create({
      ...customerCreateMock.default.customersCreateMock.customerComplete,
      emails:
        customerCreateMock.default.customersCreateMock.customerComplete.email,
      telephones:
        customerCreateMock.default.customersCreateMock.customerComplete
          .telephone,
    });

    const response = await request
      .post(baseUrl)
      .send(customerCreateMock.default.customersCreateMock.customerUniqueEmail);

    const expectResults = {
      status: 409,
      bodyMessage: {
        message: "The email 'gabrielrf@gmail.com' is already in use.",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Must not be able to create a customer - Telephone already exists", async () => {
    await Customer.create({
      ...customerCreateMock.default.customersCreateMock.customerComplete,
      emails:
        customerCreateMock.default.customersCreateMock.customerComplete.email,
      telephones:
        customerCreateMock.default.customersCreateMock.customerComplete
          .telephone,
    });

    const response = await request
      .post(baseUrl)
      .send(
        customerCreateMock.default.customersCreateMock.customerUniqueTelephone
      );

    const expectResults = {
      status: 409,
      bodyMessage: {
        message: "The phone '(28) 99921-5674' is already in use.",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Must not be able to create a customer - Invalid body", async () => {
    const response = await request
      .post(baseUrl)
      .send(customerCreateMock.default.customersCreateMock.customerInvalidBody);

    const expectResults = {
      status: 400,
      bodyMessage: {
        message: {
          fullName: ["String must contain at most 50 character(s)"],
          email: ["Invalid email"],
          telephone: [
            "Invalid phone. Use the format (XX) XXXX-XXXX or (XXX) XXX-XXXX.",
          ],
        },
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Must not be able to create a customer - Invalid Types", async () => {
    const response = await request
      .post(baseUrl)
      .send(
        customerCreateMock.default.customersCreateMock.customerInvalidBodyType
      );

    const expectResults = {
      status: 400,
      bodyMessage: {
        message: {
          fullName: ["Expected string, received number"],
          password: ["Expected string, received number"],
          email: ["Expected string, received array"],
          telephone: ["Invalid input"],
        },
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Must not be able to create a customer - Invalid body required keys", async () => {
    const response = await request
      .post(baseUrl)
      .send(customerCreateMock.default.customersCreateMock.customerInvalidKeys);

    const expectResults = {
      status: 400,
      bodyMessage: {
        message: {
          fullName: ["Required"],
          telephone: ["Invalid input"],
        },
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });
});
