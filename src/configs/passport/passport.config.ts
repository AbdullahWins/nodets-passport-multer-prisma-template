import passport from "passport";
import {
  // configureGoogleStrategy,
  // configureOtpStrategy,
  configureJwtStrategy,
  configureLocalStrategy,
} from "./strategies";
import { environment } from "../environment/environment.config";
import { ApiError } from "../../utils";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export const configurePassport = () => {
  try {
    // Local Strategies with Prisma model references
    passport.use("admin-local", configureLocalStrategy("admin"));
    passport.use("user-local", configureLocalStrategy("user"));
    passport.use("store-local", configureLocalStrategy("store"));

    // OTP Strategy (if implemented)
    // passport.use("store-otp", configureOtpStrategy(prisma.store));

    // JWT Strategies
    passport.use(
      "jwt",
      configureJwtStrategy(environment.jwt.JWT_ACCESS_TOKEN_SECRET)
    );

    // Google Strategies
    // passport.use(
    //   "admin-google",
    //   configureGoogleStrategy(
    //     prisma.admin,
    //     environment.google.GOOGLE_CLIENT_ID,
    //     environment.google.GOOGLE_CLIENT_SECRET
    //   )
    // );
    // passport.use(
    //   "user-google",
    //   configureGoogleStrategy(
    //     prisma.user,
    //     environment.google.GOOGLE_CLIENT_ID,
    //     environment.google.GOOGLE_CLIENT_SECRET
    //   )
    // );
    // passport.use(
    //   "store-google",
    //   configureGoogleStrategy(
    //     prisma.store,
    //     environment.google.GOOGLE_CLIENT_ID,
    //     environment.google.GOOGLE_CLIENT_SECRET
    //   )
    // );
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    } else {
      throw new ApiError(500, "An unknown error occurred");
    }
  }
};
