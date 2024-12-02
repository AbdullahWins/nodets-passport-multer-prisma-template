import httpStatus from "http-status";
import passport from "passport";
import { AdminResponseDto } from "../../dtos";
import {
  ApiError,
  catchAsync,
  emailProps,
  sendResponse,
  staticProps,
} from "../../utils";
import {
  generateJwtToken,
  hashPassword,
  sendEmail,
  uploadFiles,
  validateZodSchema,
} from "../../services";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { IAdmin, IAdminSignup, IAdminLogin } from "../../interfaces";
import { AdminSignupDtoZodSchema } from "../../validators";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Admin Login using Local Strategy (email/password)
export const SignInAdmin = (
  req: Request<IAdminLogin>, // Strictly typing the request body
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "admin-local",
    async (err: any, admin: IAdmin | null, info: any) => {
      // Strict type for admin
      if (err) {
        return next(err);
      }

      if (!admin) {
        return res.status(401).json({
          message: info?.message || "Invalid credentials.",
        });
      }

      // If admin is authenticated, generate JWT token
      const token = generateJwtToken(admin);

      if (!token) {
        return res.status(500).json({ message: "Token generation failed." });
      }

      const adminFromDto = new AdminResponseDto(admin);

      // Return the token and admin info
      res.status(200).json({
        message: "Logged in successfully.",
        accessToken: token,
        admin: adminFromDto,
      });
    }
  )(req, res, next);
};

// SignUp Admin (create new admin)
export const SignUpAdmin: RequestHandler = catchAsync(
  async (req: Request<{}, {}, IAdminSignup>, res: Response) => {
    // Strict typing for request body
    const { single } = req.files as { single?: Express.Multer.File[] };

    const { email, fullName, password, role }: IAdminSignup = req.body;

    validateZodSchema(AdminSignupDtoZodSchema, req.body);

    // Check if admin already exists using Prisma
    const findAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (findAdmin) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.ALREADY_EXISTS
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Data to be stored
    let constructedData: IAdminSignup = {
      email,
      fullName,
      password: hashedPassword,
      role,
      image: staticProps.default.DEFAULT_IMAGE_PATH, // default image in case no file is uploaded
    };

    // Upload files if present
    if (single && single.length > 0) {
      // single is an array of files, so we get the path of the first file
      const { filePath } = await uploadFiles(single); // Note: single is now expected to be an array
      constructedData.image =
        filePath || staticProps.default.DEFAULT_IMAGE_PATH; // fallback to default image if filePath is undefined
    }

    // Create admin using Prisma
    const admin = await prisma.admin.create({
      data: constructedData,
    });

    // Generate JWT payload and token
    const JwtPayload = {
      id: admin.id, // Use Prisma's generated `id`
      email: admin.email,
      role: admin.role,
    };

    // Generate token
    const token = generateJwtToken(JwtPayload);

    // Send welcome email asynchronously
    const emailData = {
      email: email,
      subject: emailProps.subject.WELCOME_ADMIN,
      template: emailProps.template.WELCOME_ADMIN,
      data: { name: fullName },
    };
    sendEmail(emailData);

    // Return admin data in response (using DTO)
    const adminFromDto = new AdminResponseDto(admin);

    // Send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.CREATED,
      data: {
        accessToken: token,
        admin: adminFromDto,
      },
    });
  }
);
