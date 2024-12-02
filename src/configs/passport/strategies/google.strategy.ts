// import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
// import { PrismaClient } from "@prisma/client";
// import { IUser } from "../../../interfaces";
// import { ENUM_USER_ROLES } from "../../../utils";
// import { environment } from "../../environment/environment.config";

// const prisma = new PrismaClient();

// export const configureGoogleStrategy = (
//   clientID: string,
//   clientSecret: string
// ): GoogleStrategy => {
//   return new GoogleStrategy(
//     {
//       clientID,
//       clientSecret,
//       callbackURL: environment.google.GOOGLE_REDIRECT_URI,
//       passReqToCallback: true,
//       scope: ["email", "profile"],
//     },
//     async (
//       _req: any,
//       _accessToken: string,
//       _refreshToken: string,
//       profile: Profile,
//       done: (error: any, user?: any) => void
//     ) => {
//       try {
//         // Ensure the profile has emails and at least one email entry
//         if (
//           !profile.emails ||
//           profile.emails.length === 0 ||
//           !profile.emails[0]?.value
//         ) {
//           return done(new Error("Email not provided by Google"), null);
//         }

//         // Safely extract email from the profile
//         const emailFromGoogle = profile.emails[0]?.value;

//         // Check if emailFromGoogle is a valid string
//         if (!emailFromGoogle || typeof emailFromGoogle !== "string") {
//           console.log("Error: Invalid email format");
//           return done(new Error("Invalid email format from Google"), null);
//         }

//         // Find the user by email using Prisma
//         let entity = await prisma.user.findUnique({
//           where: { email: emailFromGoogle },
//         });

//         // If user doesn't exist, create a new user
//         if (!entity) {
//           console.log("No user found, creating a new user...");
//           entity = await prisma.user.create({
//             data: {
//               fullName: profile.displayName || "",
//               username: profile.displayName || "",
//               email: emailFromGoogle,
//               googleId: profile.id,
//               role: ENUM_USER_ROLES.NORMAL_USER,
//             },
//           });

//           return done(null, entity);
//         }

//         // If user exists but Google ID is not linked, link the Google account
//         if (!entity.googleId) {
//           console.log("Linking Google account to existing user...");
//           entity = await prisma.user.update({
//             where: { email: emailFromGoogle },
//             data: { googleId: profile.id },
//           });
//           return done(null, entity);
//         }

//         return done(null, entity);
//       } catch (error) {
//         console.error("Error in Google Strategy:", error);
//         return done(error, false);
//       }
//     }
//   );
// };
