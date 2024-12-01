// src/configs/email/email.config.ts
import nodemailer from "nodemailer";
import { environment } from "../environment/environment.config";

export const transporter = nodemailer.createTransport({
  host: environment.email.NODEMAILER_EMAIL_HOSTNAME,
  port: environment.email.NODEMAILER_EMAIL_PORT,
  auth: {
    user: environment.email.NODEMAILER_EMAIL_ADDRESS,
    pass: environment.email.NODEMAILER_EMAIL_PASSWORD,
  },
});
