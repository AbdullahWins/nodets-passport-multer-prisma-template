import passport from "passport";
import { Model } from "mongoose";
import {
  configureGoogleStrategy,
  configureJwtStrategy,
  configureOtpStrategy,
  configureLocalStrategy,
} from "./strategies";
import { environment } from "../environment/environment.config";
import { Admin, Store, User } from "../../models";
import { ApiError } from "../../utils";

export const configurePassport = () => {
  try {
    // Local Strategies
    passport.use("admin-local", configureLocalStrategy(Admin as Model<any>));
    passport.use("user-local", configureLocalStrategy(User as Model<any>));
    passport.use("store-local", configureLocalStrategy(Store as Model<any>));

    // OTP Strategy
    passport.use("store-otp", configureOtpStrategy(Store as Model<any>));

    // JWT Strategies
    passport.use(
      "jwt",
      configureJwtStrategy(environment.jwt.JWT_ACCESS_TOKEN_SECRET)
    );

    // Google Strategies
    passport.use(
      "admin-google",
      configureGoogleStrategy(
        Admin as Model<any>,
        environment.google.GOOGLE_CLIENT_ID,
        environment.google.GOOGLE_CLIENT_SECRET
      )
    );
    passport.use(
      "user-google",
      configureGoogleStrategy(
        User as Model<any>,
        environment.google.GOOGLE_CLIENT_ID,
        environment.google.GOOGLE_CLIENT_SECRET
      )
    );
    passport.use(
      "store-google",
      configureGoogleStrategy(
        Store as Model<any>,
        environment.google.GOOGLE_CLIENT_ID,
        environment.google.GOOGLE_CLIENT_SECRET
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    } else {
      throw new ApiError(500, "An unknown error occurred");
    }
  }
};
