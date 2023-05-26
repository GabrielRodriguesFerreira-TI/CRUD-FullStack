import supertest from "supertest";
import app from "../../../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Customer } from "../../../models/Customer.model";
import { iCreateNewCustomer } from "../../../interfaces/customers/customers.types";
import * as customerDeleteMock from "../../mocks/index";
import { generateToken } from "../../mocks/token/token.mock";

describe("DELETE /customers", () => {
  const baseUrl: string = "/customers";
  const destroyInvalidIDUrlNumber: string =
    baseUrl + "/6452c31970aa5ce7e3073c76";
  const destroyInvalidIDUrlString: string = baseUrl + "/aaaaaa";

  let request: supertest.SuperTest<supertest.Test>;
  let server: MongoMemoryServer;

  let customerComplete: iCreateNewCustomer;
  let customerExtra: iCreateNewCustomer;

  let destroyCustomerUrl: string;
  let destroyCustomerExtraUrl: string;

  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    const uri = server.getUri();
    await mongoose.connect(uri, { autoIndex: true });
    request = supertest(app);
  });

  beforeEach(async () => {
    await Customer.deleteMany();

    customerComplete = await Customer.create({
      ...customerDeleteMock.default.customerDeleteMock.customerOwner,
      emails: customerDeleteMock.default.customerDeleteMock.customerOwner.email,
      telephones:
        customerDeleteMock.default.customerDeleteMock.customerOwner.telephone,
    });

    customerExtra = await Customer.create({
      ...customerDeleteMock.default.customerDeleteMock.customerIsNotOwner,
      emails: customerDeleteMock.default.customerDeleteMock.customerOwner.email,
      telephones:
        customerDeleteMock.default.customerDeleteMock.customerIsNotOwner
          .telephone,
    });

    destroyCustomerUrl = baseUrl + `/${customerComplete._id}`;
    destroyCustomerExtraUrl = baseUrl + `/${customerExtra._id}`;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.stop();
  });

  it("Success: Customer must be able to delete a customer - Customer token", async () => {
    const response = await request
      .delete(destroyCustomerUrl)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerDeleteMock.default.customerDeleteMock.customerOwner.email,
          customerComplete._id
        )}`
      )
      .query({
        accessToken: `${generateToken.isValidtoken(
          customerDeleteMock.default.customerDeleteMock.customerOwner.email,
          customerComplete._id
        )}`,
      });

    const expectResults = {
      status: 204,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual({});
  });

  it("Error: Customer must not be able to delete another customer - Customer token", async () => {
    const response = await request
      .delete(destroyCustomerExtraUrl)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerDeleteMock.default.customerDeleteMock.customerOwner.email,
          customerComplete._id
        )}`
      )
      .query({
        accessToken: `${generateToken.isValidtoken(
          customerDeleteMock.default.customerDeleteMock.customerOwner.email,
          customerComplete._id
        )}`,
      });

    const expectResults = {
      status: 403,
      bodyEqual: {
        message: "Insufficient permission",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to destroy - Invalid ID number", async () => {
    const response = await request
      .delete(destroyInvalidIDUrlNumber)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerDeleteMock.default.customerDeleteMock.customerOwner.email,
          customerComplete._id
        )}`
      )
      .query({
        accessToken: `${generateToken.isValidtoken(
          customerDeleteMock.default.customerDeleteMock.customerOwner.email,
          customerComplete._id
        )}`,
      });

    const expectResults = {
      status: 404,
      bodyEqual: {
        message: "Customer not found!",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to destroy - Invalid ID string", async () => {
    const response = await request
      .delete(destroyInvalidIDUrlString)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerDeleteMock.default.customerDeleteMock.customerOwner.email,
          customerComplete._id
        )}`
      )
      .query({
        accessToken: `${generateToken.isValidtoken(
          customerDeleteMock.default.customerDeleteMock.customerOwner.email,
          customerComplete._id
        )}`,
      });

    const expectResults = {
      status: 404,
      bodyEqual: {
        message:
          'Cast to ObjectId failed for value "aaaaaa" (type string) at path "_id" for model "Customers"',
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to destroy - Missing bearer", async () => {
    const response = await request.delete(destroyCustomerUrl);

    const expectResults = {
      status: 401,
      bodyEqual: {
        message: "Missing bearer token",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to destroy - Invalid signature", async () => {
    const response = await request
      .delete(destroyCustomerUrl)
      .set("Authorization", `Bearer ${generateToken.invalidSignature}`)
      .query({ accessToken: `${generateToken.invalidSignature}` });

    const expectResults = {
      status: 401,
      bodyEqual: {
        message: "invalid signature",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to destroy - JWT malformed", async () => {
    const response = await request
      .delete(destroyCustomerUrl)
      .set("Authorization", `Bearer ${generateToken.jwtMalFormed}`)
      .query({ accessToken: `${generateToken.jwtMalFormed}` });

    const expectResults = {
      status: 401,
      bodyEqual: {
        message: "jwt malformed",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });
});
