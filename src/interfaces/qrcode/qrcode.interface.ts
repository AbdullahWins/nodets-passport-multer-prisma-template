// src/interfaces/qrcode/qrcode.interface.ts

import { Types } from "mongoose";
// import { ENUM_GAME_TYPES } from "../../utils";

// Define the interface for QR code input
// export interface IQRCode {
//   data: IQRData; // Data to encode in the QR code
//   width?: number; // Width of the QR code in pixels (optional)
// }

// interface IQRData {
//   shopId: Types.ObjectId;
//   productId: Types.ObjectId;
//   gameId: Types.ObjectId;
//   ticketNumber: string;
//   gameType: ENUM_GAME_TYPES;
//   price: number;
//   sellingDate: string;
// }

// QR Code options
export interface IQRCodeOptions {
  width: number; // QR code size
  margin: number; // Padding around the QR code
  color: {
    dark: string; // Dark color (foreground)
    light: string; // Light color (background)
  };
}

// Define the type for QR code input
export type IQRCode = Types.ObjectId; // Data to encode in the QR code
