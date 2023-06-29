import fs from 'node:fs';
import { useOCR } from '../src/ocr/index.js';
import { convertPdf, verifyIfIsPdf } from '../src/pdf/index.js';
import { FILES_PATH, RESULT_PATH } from './constants/index.js';
import { processImage } from './img/index.js';

exec('newCamila.png');

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
    //.filter(({ confidence }) => confidence > 75)
    .forEach((word) => {
      text += word.text + '\n';
    });

  return text;
}

function saveResult(result) {
  const txtFileName = result.fileName.replace(/\..{3,4}$/, '.txt');
  const path = RESULT_PATH + txtFileName;
  const output = result.text.replace(/\s/g, '\n');
  let name = ''
  let doc = ''
  let isName = false
  output.split('\n').forEach((line) => {
    if (line.includes('HABILITAÇÃO'))
      isName = true
    else if (isName && (line.trim() !== '')) {
      if (line.replace(/([A-Za-z])*/g, '') !== '' || line.length < 2) {
        isName = false
      } else {
        name += line + ' '
      }
    }
    else if (line.match(/\D*\d{3}\.\d{3}\.\d{3}.\d{2}.*/)) {
      doc = line.replace(/\D*(\d{3})\.(\d{3})\.(\d{3}).(\d{2}).*/, '$1$2$3$4')
    }
  })
  console.log({
    name,
    doc,
  });

  fs.writeFileSync(path, result.text.replace(/\s/g, '\n'));
}

