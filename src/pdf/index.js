import fs from 'node:fs';
import pdfParse from 'pdf-parse';
import { pdftobuffer } from 'pdftopic';
import { FILES_PATH, TMP_PATH } from '../constants/index.js';
import { processImage } from '../img/index.js';

export async function convertPdf(_fileName) {
  const filePath = FILES_PATH + _fileName;
  const fileName = handleFileName(_fileName);
  const filesPath = [];

  const pdf = fs.readFileSync(filePath);
  await handlePDFFile(pdf, fileName, filesPath);

  return filesPath;
}

export function verifyIfIsPdf(fileName = []) {
  return fileName.includes('.pdf');
}

function handleFileName(name) {
  let fileName = name;

  if (fileName.includes('.pdf')) {
    fileName = fileName.replace('.pdf', '');
  }

  return fileName;
}

async function handlePDFFile(PDFFile, fileName, filesPath) {
  console.log(`parsing the pdf file...`);

  const PDFData = await pdfParse(PDFFile);

  if (!PDFData) {
    throw new Error('PDF data was not found!');
  }

  console.log(`${PDFData.numpages} pages were found`);

  for(let index = 0; index < PDFData.numpages; index++) {
    await convert(PDFFile, index, fileName, filesPath)
  }

  console.log("successful conversion!");
}

async function convert(PDFFile, page, fileName, filesPath) {
  console.log(`converting the ${page + 1} page of pdf file...`);

  const buffer = await pdftobuffer(PDFFile, page);
  const fileNameWithExtension = fileName + "_" + page + ".png";

  await processImage(buffer, fileNameWithExtension);

  filesPath.push(TMP_PATH + fileNameWithExtension);
}