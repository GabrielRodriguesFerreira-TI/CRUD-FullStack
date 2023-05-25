export const customerUpdateMock = {
  customerComplete: {
    fullName: "A3on",
    password: "123456",
    email: "gabrielrf@gmail.com",
    telephone: "(28) 99921-5674",
  },
  customerCompleteUpdateFull: {
    fullName: "A3on2",
    password: "1234567",
    email: "kfcgfyunfpfad@gmail.com",
    telephone: "(28) 99932-7634",
  },
  customerCompleteUpdatePartial: {
    fullName: "A3on2",
    password: "1234567",
  },
  customerUpdateError: {
    fullName: 1234,
    password: 1234,
    email: "invalid_credential",
    telephone: {},
  },
  customerUniqueEmail: {
    fullName: "A3on3",
    password: "123456",
    email: "kfcgfyunfpfad@gmail.com",
    telephone: "(28) 99911-6433",
  },
  customerIsNotOwner: {
    fullName: "Maltohumor",
    password: "123456",
    email: "antonio2@gmail.com",
    telephone: "(28) 99988-9821",
  },
  customerIsNotOwnerUpdateFull: {
    fullName: "Maltohumor2",
    password: "1234567",
    email: "antonio2@gmail.com",
    telephone: "(28) 99922-3452",
  },
  customerInvalidBody: {
    fullName: "mais de 50 caracteres!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    password: "123456",
    email: "mais de 50 caracteres!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    telephone: "mais de 50 caracteres!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
  },
};
