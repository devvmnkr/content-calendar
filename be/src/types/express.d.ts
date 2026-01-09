import { UserPublic } from "./user.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserPublic;
    }
  }
}

export {};
