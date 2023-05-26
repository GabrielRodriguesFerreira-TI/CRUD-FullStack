import supertest from "supertest";
import app from "../../../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Customer } from "../../../models/Customer.model";
import {
  iCreateNewCustomer,
  iRetrieveCustomerPagination,
  iReturnCreatedCustomer,
} from "../../../interfaces/customers/customers.types";
import { Contact } from "../../../models/Contacts.model";
import { iCreateNewContact } from "../../../interfaces/contacts/contacts.types";
import { generateToken } from "../../mocks/token/token.mock";
import * as customerRetrieveAll from "../../mocks/index";

describe("GET /customers", () => {
  const baseUrl: string = "/customers";
  const retrieveInvalidIDUrlNumber: string =
    baseUrl + "/6452c31970aa5ce7e3073c76";
  const retrieveInvalidIDUrlString: string = baseUrl + "/aaaaaa";

  let request: supertest.SuperTest<supertest.Test>;
  let server: MongoMemoryServer;
  let readCustomers: iRetrieveCustomerPagination;
  let readOneCustomer: iReturnCreatedCustomer | null;
  let customerCreate: iCreateNewCustomer;
  let contactCreate: iCreateNewContact;

  let retrieveCustomerCompleteUrl: string;

  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    const uri = server.getUri();
    await mongoose.connect(uri, { autoIndex: true });

    await Customer.create([
      { ...customerRetrieveAll.default.customerRetrieveAll.customerRetrieve1 },
      { ...customerRetrieveAll.default.customerRetrieveAll.customerRetrieve2 },
      { ...customerRetrieveAll.default.customerRetrieveAll.customerRetrieve3 },
      { ...customerRetrieveAll.default.customerRetrieveAll.customerRetrieve4 },
      { ...customerRetrieveAll.default.customerRetrieveAll.customerRetrieve5 },
    ]);

    customerCreate = new Customer({
      ...customerRetrieveAll.default.customerRetrieveAll.customerCreate,
      emails:
        customerRetrieveAll.default.customerRetrieveAll.customerCreate.email,
      telephones:
        customerRetrieveAll.default.customerRetrieveAll.customerCreate
          .telephone,
    });
    await customerCreate.save();

    contactCreate = new Contact({
      ...customerRetrieveAll.default.contactCreateMock.contactComplete,
      owner: customerCreate._id,
    });
    await contactCreate.save();

    customerCreate.contacts.push(contactCreate._id);

    await customerCreate.save();

    retrieveCustomerCompleteUrl = baseUrl + `/${customerCreate._id}`;

    const query = { deletedAt: { $exists: false } };
    const options = {
      page: 1,
      limit: 5,
      select: "-password -__v",
      sort: { createdAt: -1 },
      lean: true,
      customLabels: {
        totalDocs: "total",
        docs: "customers",
      },
    };

    readCustomers = (await Customer.paginate(
      query,
      options
    )) as unknown as iRetrieveCustomerPagination;
    readOneCustomer = await Customer.findById(customerCreate._id);

    request = supertest(app);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.stop();
  });

  it("Success: Must be able list all customers", async () => {
    const response = await request
      .get(baseUrl)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerRetrieveAll.default.customerRetrieveAll.customerCreate.email,
          customerCreate._id
        )}`
      )
      .query({
        accessToken: `${generateToken.isValidtoken(
          customerRetrieveAll.default.customerRetrieveAll.customerCreate.email,
          customerCreate._id
        )}`,
      })
      .send();

    const expectResults = {
      status: 200,
      bodyEqual: readCustomers,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(
      expect.objectContaining({
        total: expectResults.bodyEqual.total,
        limit: expectResults.bodyEqual.limit,
        totalPages: expectResults.bodyEqual.totalPages,
        page: expectResults.bodyEqual.page,
        hasNextPage: expectResults.bodyEqual.hasNextPage,
        hasPrevPage: expectResults.bodyEqual.hasPrevPage,
        nextPage: expectResults.bodyEqual.nextPage,
        prevPage: expectResults.bodyEqual.prevPage,
        pagingCounter: expectResults.bodyEqual.pagingCounter,
        customers: expect.arrayContaining([
          expect.objectContaining({
            _id: expect.any(String),
            id: expect.any(String),
            fullName: expect.any(String),
            emails: expect.any(Array),
            telephones: expect.any(Array),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      })
    );
    expect(response.body.customers).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({ password: expect.any(String) }),
      ])
    );
  });

  it("Success: Must be able list one customer - ID Customer", async () => {
    const response = await request
      .get(retrieveCustomerCompleteUrl)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerRetrieveAll.default.customerRetrieveAll.customerCreate.email,
          customerCreate._id
        )}`
      )
      .query({
        accessToken: `${generateToken.isValidtoken(
          customerRetrieveAll.default.customerRetrieveAll.customerCreate.email,
          customerCreate._id
        )}`,
      })
      .send();

    const expectResults = {
      status: 200,
      bodyEqual: readOneCustomer,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        fullName: expectResults.bodyEqual?.fullName,
        emails: expectResults.bodyEqual?.emails,
        telephones: expectResults.bodyEqual?.telephones,
        contacts: expect.arrayContaining([
          expect.objectContaining({
            _id: expect.any(String),
            email: expect.any(String),
            fullName: expect.any(String),
            telephone: expect.any(String),
            createdAt: expect.any(String),
          }),
        ]),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(response.body).toEqual(
      expect.not.objectContaining({
        password: expect.any(String),
      })
    );
  });

  it("Error: Must not be able list one customer - Invalid ID number", async () => {
    const response = await request
      .get(retrieveInvalidIDUrlNumber)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerRetrieveAll.default.customerRetrieveAll.customerCreate.email,
          customerCreate._id
        )}`
      )
      .query({
        accessToken: `${generateToken.isValidtoken(
          customerRetrieveAll.default.customerRetrieveAll.customerCreate.email,
          customerCreate._id
        )}`,
      })
      .send();

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
      .get(retrieveInvalidIDUrlString)
      .set(
        "Authorization",
        `Bearer ${generateToken.isValidtoken(
          customerRetrieveAll.default.customerRetrieveAll.customerCreate.email,
          customerCreate._id
        )}`
      )
      .query({
        accessToken: `${generateToken.isValidtoken(
          customerRetrieveAll.default.customerRetrieveAll.customerCreate.email,
          customerCreate._id
        )}`,
      })
      .send();

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

  it("Error: Must not be able list all customers: Missing token", async () => {
    const response = await request.get(baseUrl).send();

    const expectResults = {
      status: 401,
      bodyEqual: {
        message: "Missing bearer token",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able list all customers: Invalid signature", async () => {
    const response = await request
      .get(baseUrl)
      .set("Authorization", `Bearer ${generateToken.invalidSignature}`)
      .query({ accessToken: `${generateToken.invalidSignature}` })
      .send();

    const expectResults = {
      status: 401,
      bodyEqual: {
        message: "invalid signature",
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able list all customers: JWT malformed", async () => {
    const response = await request
      .get(baseUrl)
      .set("Authorization", `Bearer ${generateToken.jwtMalFormed}`)
      .query({ accessToken: `${generateToken.jwtMalFormed}` })
      .send();

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
