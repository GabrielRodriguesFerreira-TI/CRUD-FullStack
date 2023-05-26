import supertest from "supertest";
import app from "../../../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Customer } from "../../../models/Customer.model";
import { iCreateNewCustomer } from "../../../interfaces/customers/customers.types";
import * as customerUpdateMock from "../../mocks/index";
import { generateToken } from "../../mocks/token/token.mock";

describe("PATCH /customers", () => {
  const baseUrl: string = "/customers";
  const updateInvalidIDUrlNumber: string =
    baseUrl + "/6452c31970aa5ce7e3073c76";
  const updateInvalidIDUrlString: string = baseUrl + "/aaaaaa";

  let request: supertest.SuperTest<supertest.Test>;
  let server: MongoMemoryServer;
  let customerComplete: iCreateNewCustomer;
  let customerExtra: iCreateNewCustomer;
  let updatedCustomerCompleteUrl: string;
  let updatedCustomerExtraUrl: string;

  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    const uri = server.getUri();
    await mongoose.connect(uri, { autoIndex: true });
    request = supertest(app);
  });

  beforeEach(async () => {
    await Customer.deleteMany();

    customerComplete = new Customer({
      ...customerUpdateMock.default.customerUpdateMock.customerComplete,
      emails:
        customerUpdateMock.default.customerUpdateMock.customerComplete.email,
      telephones:
        customerUpdateMock.default.customerUpdateMock.customerComplete
          .telephone,
    });
    await customerComplete.save();

    updatedCustomerCompleteUrl = baseUrl + `/${customerComplete._id}`;

    customerExtra = new Customer({
      ...customerUpdateMock.default.customerUpdateMock.customerIsNotOwner,
      emails:
        customerUpdateMock.default.customerUpdateMock.customerIsNotOwner.email,
      telephones:
        customerUpdateMock.default.customerUpdateMock.customerIsNotOwner
          .telephone,
    });
    await customerExtra.save();

    updatedCustomerExtraUrl = baseUrl + `/${customerExtra._id}`;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.stop();
  });

  it("Success: Customer must be able to self update - Customer token - Full body", async () => {
    const response = await request
      .patch(updatedCustomerCompleteUrl)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        )}`
      )
      .query({
        accessToken: generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        ),
      })
      .send(
        customerUpdateMock.default.customerUpdateMock.customerCompleteUpdateFull
      );

    const customerUpdate = await Customer.findById(customerComplete._id)
      .select("-password -__v")
      .lean();

    const expectResults = {
      status: 200,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        fullName: customerUpdate?.fullName,
        emails: customerUpdate?.emails,
        telephones: customerUpdate?.telephones,
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

  it("Success: Customer must be able to self update - User token - Partial", async () => {
    const response = await request
      .patch(updatedCustomerCompleteUrl)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        )}`
      )
      .query({
        accessToken: generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        ),
      })
      .send(
        customerUpdateMock.default.customerUpdateMock
          .customerCompleteUpdatePartial
      );

    const customerUpdate = await Customer.findById(customerComplete._id)
      .select("-password -__v")
      .lean();

    const expectResults = {
      status: 200,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        fullName: customerUpdate?.fullName,
        emails: customerUpdate?.emails,
        telephones: customerUpdate?.telephones,
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

  it("Error: Customer must not be able to self update - Customer token - Invalid body types", async () => {
    const response = await request
      .patch(updatedCustomerCompleteUrl)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        )}`
      )
      .query({
        accessToken: generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        ),
      })
      .send(customerUpdateMock.default.customerUpdateMock.customerUpdateError);

    const expectResults = {
      status: 400,
      bodyMessage: {
        message: {
          fullName: ["Expected string, received number"],
          password: ["Expected string, received number"],
          email: ["Invalid email"],
          telephone: ["Invalid input"],
        },
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Must not be able to update - Invalid credential - Customer not owner", async () => {
    const response = await request
      .patch(updatedCustomerExtraUrl)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        )}`
      )
      .query({
        accessToken: generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        ),
      })
      .send(
        customerUpdateMock.default.customerUpdateMock
          .customerCompleteUpdatePartial
      );

    const expectResults = {
      status: 403,
      bodyEqual: {
        message: "Insufficient permission",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to update - Email already exists", async () => {
    const customer = new Customer({
      ...customerUpdateMock.default.customerUpdateMock.customerUniqueEmail,
      emails:
        customerUpdateMock.default.customerUpdateMock.customerUniqueEmail.email,
      telephones:
        customerUpdateMock.default.customerUpdateMock.customerUniqueEmail
          .telephone,
    });
    await customer.save();

    const response = await request
      .patch(updatedCustomerCompleteUrl)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        )}`
      )
      .query({
        accessToken: generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        ),
      })
      .send(
        customerUpdateMock.default.customerUpdateMock.customerCompleteUpdateFull
      );

    const expectResults = {
      status: 409,
      bodyEqual: {
        message: "The email 'kfcgfyunfpfad@gmail.com' is already in use.",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to update - Invalid ID Number", async () => {
    const response = await request
      .patch(updateInvalidIDUrlNumber)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        )}`
      )
      .query({
        accessToken: generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        ),
      })
      .send(customerUpdateMock.default.customerUpdateMock.customerComplete);

    const expectResults = {
      status: 404,
      bodyEqual: {
        message: "Customer not found!",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to update - Invalid ID string", async () => {
    const response = await request
      .patch(updateInvalidIDUrlString)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        )}`
      )
      .query({
        accessToken: generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        ),
      })
      .send(customerUpdateMock.default.customerUpdateMock.customerComplete);

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

  it("Error: Must not be able to update - Missing bearer", async () => {
    const response = await request
      .patch(updatedCustomerCompleteUrl)
      .send(customerUpdateMock.default.customerUpdateMock.customerComplete);

    const expectResults = {
      status: 401,
      bodyEqual: {
        message: "Missing bearer token",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to update - Invalid signature", async () => {
    const response = await request
      .patch(updatedCustomerCompleteUrl)
      .set("Authorization", `Bearer ${generateToken.invalidSignature}`)
      .query({
        accessToken: generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        ),
      })
      .send(customerUpdateMock.default.customerUpdateMock.customerComplete);

    const expectResults = {
      status: 401,
      bodyEqual: {
        message: "invalid signature",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to update - JWT malformed", async () => {
    const response = await request
      .patch(updatedCustomerCompleteUrl)
      .set("Authorization", `Bearer ${generateToken.jwtMalFormed}`)
      .query({
        accessToken: generateToken.isValidtoken(
          customerUpdateMock.default.customerUpdateMock.customerComplete.email,
          customerComplete._id
        ),
      })
      .send(customerUpdateMock.default.customerUpdateMock.customerComplete);

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
