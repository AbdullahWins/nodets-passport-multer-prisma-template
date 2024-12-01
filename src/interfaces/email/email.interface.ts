// src/interfaces/email.interfaces.ts

export interface ISendEmail {
  email: string;
  subject: string;
  template: string;
  data: object;
}

export interface IEmailData {
  email: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export interface IEMailPayload {
  email: string;
  subject: string;
  htmlContent: string;
}
