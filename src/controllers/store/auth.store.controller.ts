import httpStatus from "http-status";
import { Request, RequestHandler, Response } from "express";
import { Store } from "../../models";
import {
  comparePassword,
  generateJwtToken,
  generateOtp,
  hashPassword,
  otpExpiresIn,
  sendEmail,
  uploadFiles,
  validateZodSchema,
} from "../../services";
import {
  ApiError,
  catchAsync,
  emailProps,
  staticProps,
  sendResponse,
} from "../../utils";
import {
  IEmailData,
  IStoreLogin,
  IOtpData,
  IMulterFiles,
  IStoreAdd,
} from "../../interfaces";
import {
  StoreLoginDtoZodSchema,
  StoreOtpDtoZodSchema,
  StoreResponseDto,
  StoreSignupDtoZodSchema,
} from "../../dtos";

// Sign-In: Generate OTP for Store
export const SignInStore: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body as IStoreLogin;

    // Validate the request data
    validateZodSchema(StoreLoginDtoZodSchema, req.body);

    // Check if store exists
    const store = await Store.findOne({ email });
    if (!store) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    // Validate password
    const isValidPassword = await comparePassword(password, store.password);
    if (!isValidPassword) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.INVALID_CREDENTIALS
      );
    }

    // Generate OTP and hash it
    const otp = await generateOtp();
    const hashedOtp = await hashPassword(otp);

    // Save OTP and expiration in the store record
    store.otp = hashedOtp;
    store.otpExpires = otpExpiresIn(); // Expiration time (e.g., 5 minutes)
    await store.save();

    // Send OTP via email
    const emailData: IEmailData = {
      email,
      subject: emailProps.subject.VERIFY_2FA,
      template: emailProps.template.VERIFY_2FA,
      data: { name: store.name, otp },
    };
    sendEmail(emailData); // Non-blocking email send

    // Respond with success
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.otp.OTP_SENT,
      data: null,
    });
  }
);

// Verify OTP for Store
export const VerifyOtpStore: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body as IOtpData;

    // Validate the request data
    validateZodSchema(StoreOtpDtoZodSchema, req.body);

    // Check if store exists
    const store = await Store.findOne({ email });
    if (!store) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    // Check OTP validity
    if (!store.otp || !store.otpExpires) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.INVALID_CREDENTIALS
      );
    }

    // Verify OTP and expiration
    const isCorrectOtp = await comparePassword(otp, store.otp);
    const isOtpValid = new Date(store.otpExpires) > new Date();
    if (!isCorrectOtp || !isOtpValid) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.INVALID_CREDENTIALS
      );
    }

    // Clear OTP and expiration
    store.otp = undefined;
    store.otpExpires = undefined;
    await store.save();

    // Generate JWT
    const jwtPayload = {
      _id: store._id,
      email: store.email,
      role: store.role,
    };
    const token = generateJwtToken(jwtPayload);

    // Send response with JWT
    const storeResponse = new StoreResponseDto(store);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.otp.OTP_VERIFIED,
      data: {
        accessToken: token,
        store: storeResponse,
      },
    });
  }
);

// add store
export const AddOneStore: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;
    const { name, address, email, phone, password, role } =
      parsedData as IStoreAdd;
    const { single, document } = req.files as IMulterFiles;

    // validate data with zod schema
    validateZodSchema(StoreSignupDtoZodSchema, parsedData);

    // check if store already exists
    const findStore = await Store.isEntityExistsByEmail(email);
    if (findStore) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.ALREADY_EXISTS
      );
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // data to be stored
    let updatedData = {
      name,
      address,
      email,
      phone,
      password: hashedPassword,
      image: staticProps.default.DEFAULT_IMAGE_PATH,
      document: staticProps.default.DEFAULT_DOCUMENT_PATH,
      role,
    };

    // Upload files
    if (single || document) {
      const { filePath, documentPath } = await uploadFiles(single, document);
      updatedData = {
        ...updatedData,
        image: filePath || staticProps.default.DEFAULT_IMAGE_PATH,
        document: documentPath || staticProps.default.DEFAULT_DOCUMENT_PATH,
      };
    }

    // create store
    const store = await Store.create(updatedData);

    // email data
    const emailData: IEmailData = {
      email,
      subject: emailProps.subject.WELCOME_STORE,
      template: emailProps.template.WELCOME_STORE,
      data: { name: name, email: email, password: password },
    };

    // not awaiting for the email to be sent
    sendEmail(emailData);

    // store data
    const storeFromDto = new StoreResponseDto(store);

    // send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.CREATED,
      data: storeFromDto,
    });
  }
);
