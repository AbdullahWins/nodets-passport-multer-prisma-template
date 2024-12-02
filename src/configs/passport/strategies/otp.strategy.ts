// import { Strategy as CustomStrategy } from "passport-custom";
// import { PrismaClient } from "@prisma/client";
// import httpStatus from "http-status";
// import bcrypt from "bcrypt";
// import { ApiError } from "../../../utils";

// const prisma = new PrismaClient();

// export const configureOtpStrategy = (): CustomStrategy => {
//   return new CustomStrategy(async (req, done) => {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return done(
//         new ApiError(httpStatus.BAD_REQUEST, "Email and OTP are required"),
//         false
//       );
//     }

//     try {
//       // Find the store by email using Prisma
//       const store = await prisma.store.findUnique({
//         where: { email },
//       });

//       if (!store) {
//         return done(
//           new ApiError(httpStatus.NOT_FOUND, "Store not found"),
//           false
//         );
//       }

//       // Check if OTP exists and is valid
//       if (!store.otp || !store.otpExpires) {
//         return done(
//           new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired OTP"),
//           false
//         );
//       }

//       // Check if OTP has expired
//       const isOtpValid = new Date(store.otpExpires) > new Date();
//       if (!isOtpValid) {
//         return done(
//           new ApiError(httpStatus.UNAUTHORIZED, "OTP has expired"),
//           false
//         );
//       }

//       // Compare the provided OTP with the hashed OTP
//       const isCorrectOtp = await bcrypt.compare(otp, store.otp);
//       if (!isCorrectOtp) {
//         return done(
//           new ApiError(httpStatus.UNAUTHORIZED, "Incorrect OTP"),
//           false
//         );
//       }

//       // Clear OTP and expiration after successful verification using Prisma
//       await prisma.store.update({
//         where: { email },
//         data: {
//           otp: null,
//           otpExpires: null,
//         },
//       });

//       return done(null, store);
//     } catch (error) {
//       return done(error, false);
//     }
//   });
// };
