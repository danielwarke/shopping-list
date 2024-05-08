import { Request } from "express";

export class JwtRequest extends Request {
  user: {
    userId: string;
    email: string;
    name: string;
  };
}
