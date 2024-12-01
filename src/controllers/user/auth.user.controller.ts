import { NextFunction, Request, RequestHandler, Response } from "express";
import passport from "passport";
import httpStatus from "http-status";
import {
  generateJwtToken,
  hashPassword,
  sendEmail,
  uploadFiles,
  validateZodSchema,
} from "../../services";
import {
  ApiError,
  catchAsync,
  emailProps,
  sendResponse,
  staticProps,
} from "../../utils";
import { UserResponseDto, UserSignupDtoZodSchema } from "../../dtos";
import { User } from "../../models";
import {
  IMulterFiles,
  IUser,
  PassportAuthError,
  PassportAuthInfo,
} from "../../interfaces";

// User Login using Local Strategy (email/password)
export const SignInUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "user-local",
    async (err: PassportAuthError, user: IUser, info: PassportAuthInfo) => {
      if (err) {
        return next(err); // Handle errors during authentication
      }

      if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: info?.message || staticProps.common.INVALID_CREDENTIALS,
        });
      }

      // Generate JWT token
      const token = generateJwtToken({
        _id: user._id,
        email: user.email,
        role: user.role,
      });

      if (!token) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Token generation failed."
        );
      }

      // Create user response DTO
      const userFromDto = new UserResponseDto(user);

      // Send response with token
      sendResponse(res, {
        statusCode: httpStatus.OK,
        message: staticProps.common.LOGGED_IN,
        data: {
          accessToken: token,
          user: userFromDto,
        },
      });
    }
  )(req, res, next); // Pass request to passport.authenticate
};

// User Login using Google Strategy (Google OAuth)
export const SignInUserWithGoogle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "user-google", // Use the name of your Google strategy
    async (err: PassportAuthError, user: IUser, info: PassportAuthInfo) => {
      if (err) {
        return next(err); // Handle errors during authentication
      }

      if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: info?.message || staticProps.common.INVALID_CREDENTIALS,
        });
      }

      // Generate JWT token for the authenticated user
      const token = generateJwtToken({
        _id: user._id,
        email: user.email,
        role: user.role,
      });

      if (!token) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Token generation failed."
        );
      }

      // Create user response DTO (data transfer object) for consistent response format
      const userFromDto = new UserResponseDto(user);

      // Send the response with the generated token and user data
      sendResponse(res, {
        statusCode: httpStatus.OK,
        message: staticProps.common.LOGGED_IN, // Or any other relevant message
        data: {
          accessToken: token,
          user: userFromDto,
        },
      });
    }
  )(req, res, next); // Pass the request to passport.authenticate
};

// User Signup
export const SignUpUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { single } = req.files as IMulterFiles;
    const { email, fullName, username, password } = req.body;

    //validate the request data
    validateZodSchema(UserSignupDtoZodSchema, req.body);

    // Check if user already exists
    const findUser = await User.isEntityExistsByEmail(email);
    if (findUser) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.ALREADY_EXISTS
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Construct the user data
    let constructedData = {
      email,
      fullName,
      username,
      password: hashedPassword,
      image: staticProps.default.DEFAULT_IMAGE_PATH,
    };

    // Handle file upload
    if (single) {
      const { filePath } = await uploadFiles(single);
      constructedData = {
        ...constructedData,
        image: filePath || staticProps.default.DEFAULT_IMAGE_PATH,
      };
    }

    // Create the user in the database
    const user = await User.create(constructedData);

    // Generate JWT payload and token
    const jwtPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = generateJwtToken(jwtPayload);

    // Send a welcome email asynchronously
    const emailData = {
      email,
      subject: emailProps.subject.WELCOME_USER,
      template: emailProps.template.WELCOME_USER,
      data: { name: fullName },
    };
    sendEmail(emailData);

    // Create user DTO response
    const userFromDto = new UserResponseDto(user);

    // Prepare the response data
    const updatedData = {
      accessToken: token,
      user: userFromDto,
    };

    // Send the response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.CREATED,
      data: updatedData,
    });
  }
);
