import fs from 'node:fs';
import { useOCR } from '../src/ocr/index.js';
import { convertPdf, verifyIfIsPdf } from '../src/pdf/index.js';
import { FILES_PATH, RESULT_PATH } from './constants/index.js';
import { processImage } from './img/index.js';

exec('cnh_files/cnhtest2.png');

async function exec(fileName) {
  const filePaths = await processFile(fileName);
  const result = { fileName, text: '' };

  console.log('OCR started');
  console.log('OCR is reading the file...');

  if (!filePaths || filePaths.length <= 0) {
    console.log('no file to process');
  }

  for(const filePath of filePaths) {
    result.text += await getResult(filePath);
  }

  console.log('OCR finished');

  saveResult(result);
}

async function processFile(fileName) {
  const isPDF = verifyIfIsPdf(fileName);
  if (isPDF) {
    return await convertPdf(fileName);
  } else {
    const filePath = FILES_PATH + fileName;
    await processImage(filePath, fileName);
    return [filePath];
  }
}

async function getResult(filePath) {
  let text = '';
  const result = await useOCR(filePath);

  result.data.words
    .filter(({ confidence }) => confidence > 75)
    .forEach((word) => {
      text += word.text + '\n';
    });

  return text;
}

function saveResult(result) {
  const txtFileName = result.fileName.replace(/\..{3,4}$/, '.txt');
  const path = RESULT_PATH + txtFileName;

  fs.writeFileSync(path, result.text.replace(/\s/g, '\n'));
}

