// src/types/index.d.ts
import { IJwtPayload, IMulterFiles } from "../interfaces";

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload | null | undefined;
      file: any;
      files: any;
    }
  }
}
