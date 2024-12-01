// src/utils/enums/payment.enum.ts
export enum ENUM_PAYMENT_STATUS_NAME {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
}

// converting all enum to arrays

export const PayemntStatusEnumValues = Object.values(ENUM_PAYMENT_STATUS_NAME);
