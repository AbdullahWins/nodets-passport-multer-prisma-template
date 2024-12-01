import QRCode from "qrcode";
import httpStatus from "http-status";
import { IQRCode } from "../../interfaces";
import { qrCodeOptions } from "../../configs";
import { ApiError, staticProps } from "../../utils";

// Function to generate a QR code as a Base64 string
export const generateQRCode = async (payload: IQRCode): Promise<string> => {
  if (!payload) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.TEXT_REQUIRED_FOR_QR_CODE
    );
  }

  // Serialize the data into a JSON string for encoding
  const serializedData = JSON.stringify(payload);

  // Options for QR code generation
  const options = qrCodeOptions;

  try {
    // Generate the Base64 QR code
    const qrCode = await QRCode.toDataURL(serializedData, options);
    return qrCode;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : staticProps.common.SOMETHING_WENT_WRONG;

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, errorMessage);
  }
};
