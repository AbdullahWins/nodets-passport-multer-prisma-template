import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";
import { IConfigureJwtStrategy, IJwtPayload } from "../../../interfaces";
import { Admin, Store, User } from "../../../models";
import {
  ENUM_ADMIN_ROLES,
  ENUM_STORE_ROLES,
  ENUM_USER_ROLES,
  staticProps,
} from "../../../utils";

export const configureJwtStrategy: IConfigureJwtStrategy = (
  jwtSecret: string
) => {
  const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
  };

  return new JwtStrategy(
    options,
    async (payload: IJwtPayload, done: VerifiedCallback) => {
      try {
        // Directly determine and fetch the entity based on role
        let entity = null;

        if (
          Object.values(ENUM_USER_ROLES).includes(
            payload.role as ENUM_USER_ROLES
          )
        ) {
          entity = await User.findById(payload._id);
        } else if (
          Object.values(ENUM_STORE_ROLES).includes(
            payload.role as ENUM_STORE_ROLES
          )
        ) {
          entity = await Store.findById(payload._id);
        } else if (
          Object.values(ENUM_ADMIN_ROLES).includes(
            payload.role as ENUM_ADMIN_ROLES
          )
        ) {
          entity = await Admin.findById(payload._id);
        } else {
          return done(null, false, {
            message: staticProps.jwt.INVALID_ROLE_IN_JWT,
          });
        }

        if (entity) {
          return done(null, entity);
        } else {
          return done(null, false, {
            message: staticProps.jwt.NO_ENTITY_FOUND,
          });
        }
      } catch (error) {
        console.error(staticProps.jwt.JWT_STRATEGY_ERROR, error);
        return done(error, false);
      }
    }
  );
};
