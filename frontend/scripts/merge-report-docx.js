const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(
  path.join(__dirname, '../public/ex_report_gen/script.js'),
  'utf8'
);
const lines = src.split(/\r?\n/);
const body = lines.slice(33, 1643).join('\n');

const header = `import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
} from 'docx';
import { saveAs } from 'file-saver';

const COLLECTION_KEYS = [
  'erecog', 'ijp', 'njp', 'book', 'nca', 'ica', 'ps', 'pa', 'ifps', 'ifpf', 'pat', 'si',
  'fdpa', 'ea', 'webc', 'fdpc', 'semc', 'wc', 'icc', 'ncc', 'indc', 'mou', 'ai', 'cv', 'oa',
  'scc', 'sec', 'ntsa',
];

export function fetchAllArrayToResult(data) {
  if (!Array.isArray(data)) return {};
  const result = {};
  data.forEach((item) => {
    if (item.collection && Array.isArray(item.records)) {
      result[item.collection] = item.records;
    }
  });
  return result;
}

function normalizeResult(result) {
  const out = { ...result };
  COLLECTION_KEYS.forEach((k) => {
    if (!Array.isArray(out[k])) out[k] = [];
  });
  return out;
}

/**
 * Build monthly activities DOCX from MongoDB /fetchall-shaped result map.
 * @param {Record<string, unknown[]>} rawResult - map of collection name -> documents
 * @param {{ reportMonth?: string; reportYear?: string; fileName?: string }} [options]
 */
export async function generateMonthlyActivitiesDocx(rawResult, options = {}) {
  const result = normalizeResult(rawResult || {});
  const reportMonth = options.reportMonth ?? 'January';
  const reportYear = options.reportYear ?? String(new Date().getFullYear());
`;

let modifiedBody = body
  .replace(/const report_month = "May";\s*\n\s*const report_year = "2024";/m, '')
  .replace(
    /text: `MONTHLY ACTIVITIES OF THE DEPARTMENT \(\$\{report_month\} \$\{report_year\}\)`/,
    'text: `MONTHLY ACTIVITIES OF THE DEPARTMENT (${reportMonth} ${reportYear})`',
  );

modifiedBody = modifiedBody.replace(
  /\/\/ Generate and save the document\s*\n\s*Packer\.toBlob\(doc\)\.then\(blob => \{[\s\S]*?\}\);/m,
  `const blob = await Packer.toBlob(doc);
  const fname = options.fileName ?? \`monthly-activities-\${reportMonth}-\${reportYear}.docx\`.replace(/\\s+/g, '-');
  saveAs(blob, fname);
  return blob;`,
);

const out = `${header}\n${modifiedBody}\n}\n`;

const outPath = path.join(__dirname, '../src/lib/reportDocx/generateMonthlyActivitiesDocx.js');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out, 'utf8');
console.log('Wrote', outPath, 'bytes', out.length);
