import sharp from "sharp";
import { TMP_PATH } from "../constants/index.js";

export async function processImage(image, fileName) {
  try {
    const outputPath = TMP_PATH + fileName;
    const inputBuffer = await sharp(image).toBuffer();

    await sharp(inputBuffer)
      .greyscale(true)
      .toFile(outputPath);
  } catch (err) {
    console.error(err.message);
    throw err
  }
}