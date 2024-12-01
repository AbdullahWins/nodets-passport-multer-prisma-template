// src/middleware/authorizeEntity.ts

import { NextFunction, Request, Response } from "express";
import passport from "passport";
import httpStatus from "http-status";
import { ApiError, ENUM_AUTH_ROLES, staticProps } from "../../utils";
import { IJwtPayload } from "../../interfaces";

// Auth middleware for roles
export const authorizeEntity =
  (roles?: ENUM_AUTH_ROLES[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = req.user as IJwtPayload;

      if (!user) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          staticProps.jwt.INVALID_TOKEN
        );
      }

      // Check if the role is allowed
      const allowedRoles = roles ?? Object.values(ENUM_AUTH_ROLES);

      if (!allowedRoles.includes(user.role as ENUM_AUTH_ROLES)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `Forbidden: Required roles '${allowedRoles.join(", ")}' but found '${
            user.role
          }'`
        );
      }

      // Attach user to request object if needed
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };

// Auth middleware for routes
export const authenticateEntity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: IJwtPayload) => {
      if (err) {
        return next(err);
      }
      if (user) {
        req.user = user;
        return next();
      }
      return res.status(401).json({
        message: "Entity authentication failed",
        error: "Unauthorized",
      });
    }
  )(req, res, next);
};
