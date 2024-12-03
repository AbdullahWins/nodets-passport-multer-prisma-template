import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";
import { IConfigureJwtStrategy, IJwtPayload } from "../../../interfaces";
import { PrismaClient } from "@prisma/client";
import {
  ENUM_ADMIN_ROLES,
  // ENUM_STORE_ROLES,
  // ENUM_USER_ROLES,
} from "../../../constants";
import { staticProps } from "../../../constants";

const prisma = new PrismaClient();

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
      console.log("Decoded JWT Payload: ", payload); // Ensure payload is correctly decoded

      try {
        // Directly determine and fetch the entity based on the role
        let entity = null;

        // Example for USER role, you can uncomment and modify if needed
        // if (
        //   Object.values(ENUM_USER_ROLES).includes(
        //     payload.role as ENUM_USER_ROLES
        //   )
        // ) {
        //   entity = await prisma.user.findUnique({
        //     where: { id: payload.id },
        //   });
        // } else if (
        //   Object.values(ENUM_STORE_ROLES).includes(
        //     payload.role as ENUM_STORE_ROLES
        //   )
        // ) {
        //   entity = await prisma.store.findUnique({
        //     where: { id: payload.id },
        //   });
        // } else

        if (
          Object.values(ENUM_ADMIN_ROLES).includes(
            payload.role as ENUM_ADMIN_ROLES
          )
        ) {
          // Query Prisma for the admin by the id in the payload
          entity = await prisma.admin.findUnique({
            where: { id: payload.id },
          });
        } else {
          return done(null, false, {
            message: staticProps.jwt.INVALID_ROLE_IN_JWT,
          });
        }

        // Return the entity if found
        if (entity) {
          return done(null, entity);
        } else {
          return done(null, false, {
            message: staticProps.jwt.NO_ENTITY_FOUND,
          });
        }
      } catch (error) {
        console.error(staticProps.jwt.JWT_STRATEGY_ERROR, error); // Log the actual error for debugging
        return done(error, false); // Pass the error to the callback to handle failure
      }
    }
  );
};
