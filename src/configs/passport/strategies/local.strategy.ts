import { Strategy as LocalStrategy } from "passport-local";
import * as bcrypt from "bcrypt"; // Assuming you are using IAdmin for the model interface
import { PrismaClient } from "@prisma/client"; // PrismaClient to interact with PostgreSQL

const prisma = new PrismaClient() as PrismaClient & {
  admin: {
    findUnique: (args: {
      where: { email: string };
    }) => Promise<{ password: string } | null>;
  };
  user: {
    findUnique: (args: {
      where: { email: string };
    }) => Promise<{ password: string } | null>;
  };
  store: {
    findUnique: (args: {
      where: { email: string };
    }) => Promise<{ password: string } | null>;
  };
};

interface IConfigureLocalStrategy {
  (model: "admin" | "user" | "store"): LocalStrategy;
}

export const configureLocalStrategy: IConfigureLocalStrategy = (model) => {
  return new LocalStrategy(
    {
      usernameField: "email", // 'email' is the field name in your form-data
      passwordField: "password", // 'password' is the field name in your form-data
      passReqToCallback: true,
    },
    async (_req, email: string, password: string, done) => {
      try {
        // Fetch the user (Admin, User, or Store) from the database using Prisma
        const entity = await prisma[model].findUnique({
          where: { email },
        });

        if (!entity) {
          return done(null, false, { message: `${model} not found` });
        }
        if (!entity.password) {
          return done(null, false, { message: "No password set" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, entity.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password" });
        }

        // Return the entity if authentication is successful
        return done(null, entity);
      } catch (error) {
        return done(error, false);
      }
    }
  );
};
