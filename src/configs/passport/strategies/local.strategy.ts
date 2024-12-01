// src/configs/passport/strategies/local.strategy.ts
import { Strategy as LocalStrategy } from "passport-local";
import * as bcrypt from "bcrypt";
import { IConfigureLocalStrategy } from "../../../interfaces";

export const configureLocalStrategy: IConfigureLocalStrategy = (model) => {
  return new LocalStrategy(
    {
      usernameField: "email", // 'email' is the field name in your form-data
      passwordField: "password", // 'password' is the field name in your form-data
    },
    async (email, password, done) => {
      try {
        const entity = await model.findOne({ email }).select("+password");
        if (!entity) return done(null, false, { message: "Admin not found" });
        if (!entity.password)
          return done(null, false, { message: "No password set" });

        const isPasswordValid = await bcrypt.compare(password, entity.password);
        if (!isPasswordValid)
          return done(null, false, { message: "Incorrect password" });

        return done(null, entity);
      } catch (error) {
        return done(error, false);
      }
    }
  );
};
