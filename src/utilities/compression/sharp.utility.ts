// Compress the image and overwrite the original
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Compress the image and overwrite the original
export const compressImage = async (
  inputPath: string,
  targetSize: number = 100000, // Target size in bytes (e.g., 100KB)
  qualityStep: number = 10, // Quality decrement step (e.g., reduce by 10%)
  maxRetries: number = 10 // Maximum number of retries to avoid infinite loop
): Promise<string> => {
  try {
    const extname = path.extname(inputPath).toLowerCase();
    const tempOutputPath = inputPath + ".temp";

    let image = sharp(inputPath);
    let currentQuality = 80; // Initial quality

    // Compress until the file size is less than the target size
    let retries = 0;
    let fileSize = fs.statSync(inputPath).size;

    // Perform compression and reduce quality iteratively
    while (fileSize > targetSize && retries < maxRetries) {
      retries++;

      // Reset the image for each iteration
      image = sharp(inputPath);

      if (extname === ".jpg" || extname === ".jpeg") {
        image = image.jpeg({ quality: currentQuality });
      } else if (extname === ".png") {
        image = image.png({ quality: currentQuality });
      } else if (extname === ".webp") {
        image = image.webp({ quality: currentQuality });
      }

      // Resize the image
      image = image.resize({ width: 800, withoutEnlargement: true });

      // Write to a temporary file
      await image.toFile(tempOutputPath);

      // Update the file size after compression
      fileSize = fs.statSync(tempOutputPath).size;

      // Reduce the quality for the next iteration if the file is still too large
      if (fileSize > targetSize) {
        console.log("Current quality:", currentQuality);
        currentQuality = Math.max(currentQuality - qualityStep, 10); // Don't reduce below 10% quality
      }
    }

    // Replace the original file with the compressed version
    fs.renameSync(tempOutputPath, inputPath);

    console.log("Image compressed to target size successfully:", inputPath);
    return inputPath; // Return the path of the original file (now compressed)
  } catch (error) {
    console.error("Error compressing image:", error);
    throw new Error("Image compression failed");
  }
};
