import { createWorker, PSM } from 'tesseract.js';

export async function useOCR(filePath) {
  const worker = await createWorker();
  await worker.loadLanguage('por');
  await worker.initialize('por');
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.AUTO,
  });

  const result = await worker.recognize(filePath);

  await worker.terminate();

  return result;
}