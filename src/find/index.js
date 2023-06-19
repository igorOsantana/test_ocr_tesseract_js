import fs from 'node:fs';
import { RESULT_PATH } from '../constants';

exec(
  'nome',
  '23',
  'cpf',
  '16082022',
  'casado',
  'espólio',
  'relação',
  'assesorou',
  'registro',
  'aline'
);

function exec(file = '', ...words) {
  const path = RESULT_PATH + file;
  if (fs.existsSync(path) === false) {
    throw new Error('File not found');
  }

  const content = fs.readFileSync(path, 'utf-8').toLowerCase();

  return words.forEach(word => {
    find(word, content);
  });
}

function find(word, content) {
  const charsBefore = 10;
  const charsAfter = 10;
  const regex = new RegExp(`\\b(?:\\S+\\s+){0,${charsBefore}}(\\S*\\b${word}\\b\\S*){1}(?:\\s+\\S+){0,${charsAfter}}\\b`);
  const match = regex.exec(content);

  if (match) {
    const context =  match[0].replace(/\n/g, ' ');
    console.log(`✅ - [${word.toUpperCase()}] - ${context}\n`);
  } else {
    console.log(`❌ - [${word.toUpperCase()}]\n`);
  }

}