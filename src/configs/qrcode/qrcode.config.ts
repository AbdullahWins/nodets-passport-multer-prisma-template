import { IQRCodeOptions } from "../../interfaces";
import { staticProps } from "../../constants";

// Options for QR code generation
export const qrCodeOptions: IQRCodeOptions = {
  width: 300, // QR code size
  margin: 4, // Padding around the QR code
  color: {
    dark: staticProps.color.BLACK, // Dark color (foreground)
    light: staticProps.color.WHITE, // Light color (background)
  },
};
