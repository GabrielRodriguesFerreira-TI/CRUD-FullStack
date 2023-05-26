import "dotenv/config";
import { sign } from "jsonwebtoken";

export const generateToken = {
  isValidtoken: (email: string, id: number) => {
    return sign({ email }, String(process.env.ACCESS_TOKEN_SECRET), {
      expiresIn: "24h",
      subject: id.toString(),
    });
  },
  invalidSignature: sign({ email: true }, "invalida_signature"),
  jwtMalFormed: "12345",
};
