import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { convertMapData } from '../dist/index.js';
import { configuredShapeMapData, glyphSegmentMapData } from './fixtures/fixtures.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../tmp');

mkdirSync(outDir, { recursive: true });

const datasets = [
  { name: 'segment', data: glyphSegmentMapData },
  { name: 'configured', data: configuredShapeMapData },
];

for (const { name, data } of datasets) {
  const doc = convertMapData(data);
  const outPath = resolve(outDir, `${name}.json`);
  writeFileSync(outPath, JSON.stringify(doc.toJSON(), null, 4), 'utf-8');
  console.log(`Written: ${outPath}`);
}
