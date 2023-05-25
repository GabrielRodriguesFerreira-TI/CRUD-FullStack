export const customersCreateMock = {
  customerComplete: {
    fullName: "A3on",
    password: "123456",
    email: "gabrielrf@gmail.com",
    telephone: "(28) 99921-5674",
  },
  customerUniqueEmail: {
    fullName: "Maltohumor",
    password: "123456",
    email: "gabrielrf@gmail.com",
    telephone: "(28) 99956-7435",
  },
  customerUniqueTelephone: {
    fullName: "A3on",
    password: "123456",
    email: "antonio1@gmail.com",
    telephone: "(28) 99921-5674",
  },
  customerInvalidBodyType: {
    fullName: 1234,
    password: 1234,
    email: [],
    telephone: {},
  },
  customerInvalidKeys: {
    email: "gabrielrf@gmail.com",
    password: "123456",
  },
  customerInvalidBody: {
    fullName: "mais de 50 caracteres!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    password: "123456",
    email: "mais de 50 caracteres!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    telephone: "mais de 50 caracteres!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
  },
  customerReturnComplete: {
    fullName: "A3on",
    emails: ["gabrielrf@gmail.com"],
    telephones: ["(28) 99921-5674"],
    contacts: [],
  },
};
