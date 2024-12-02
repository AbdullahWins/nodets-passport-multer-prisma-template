// src/interfaces/qrcode/qrcode.interface.ts

// QR Code options
export interface IQRCodeOptions {
  width: number; // QR code size
  margin: number; // Padding around the QR code
  color: {
    dark: string; // Dark color (foreground)
    light: string; // Light color (background)
  };
}
