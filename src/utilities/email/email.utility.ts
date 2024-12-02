// src/services/email/email.service.ts
import httpStatus from "http-status";
import { environment, transporter } from "../../configs";
import { ApiError } from "..";
import { renderTemplate } from "../handlebar/handlebar.utility";
import { errorLogger, infoLogger } from "../logger/logger.utility";
import { IEMailPayload, ISendEmail } from "../../interfaces";
import { staticProps } from "../../constants";

// Function to handle send email errors
const handleSendEmailError = (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : "unknown";
  errorLogger.error(`Error on mail server: ${errorMessage}`);
  throw new ApiError(
    httpStatus.INTERNAL_SERVER_ERROR,
    staticProps.email.EMAIL_NOT_SENT
  );
};

const validateEmailInput = (payload: ISendEmail) => {
  const { email, subject, template } = payload;
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, staticProps.email.EMAIL_MISSING);
  }
  if (!subject) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.email.SUBJECT_MISSING
    );
  }
  if (!template) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.email.TEMPLATE_MISSING
    );
  }
};

const sendMail = async (payload: IEMailPayload) => {
  const { email, subject, htmlContent } = payload;
  const response = await transporter.sendMail({
    from: environment.email.NODEMAILER_EMAIL_ADDRESS,
    to: email,
    subject: subject,
    html: htmlContent,
  });
  return response;
};

export const sendEmail = async (payload: ISendEmail) => {
  const { email, subject, template, data } = payload;
  validateEmailInput({ email, subject, template, data });
  try {
    await transporter.verify();
    infoLogger.info(staticProps.email.EMAIL_SERVER_READY);
    const htmlContent = renderTemplate(template, data);

    if (!htmlContent) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.email.TEMPLATE_RENDER_ERROR
      );
    }
    const payload = { email, subject, htmlContent };
    const status = await sendMail(payload);
    infoLogger.info(`Email sent to ${email}`);
    return status;
  } catch (error) {
    return handleSendEmailError(error);
  }
};
