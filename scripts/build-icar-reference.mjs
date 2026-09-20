import { createHash } from 'node:crypto';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import console from 'node:console';
import { URL } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

// CC0 human-response data. No simulated participants, imputation or population adjustment.
const url = 'https://dataverse.harvard.edu/api/access/datafile/10991957';
const cache = new URL('../.cache/icar/responses.csv', import.meta.url);
let bytes;
try {
  bytes = await readFile(cache);
} catch {
  const response = await globalThis.fetch(url);
  if (!response.ok) throw new Error(`Reference download failed: ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
  await mkdir(new URL('../.cache/icar/', import.meta.url), { recursive: true });
  await writeFile(cache, bytes);
}
const sha256 = createHash('sha256').update(bytes).digest('hex');
if (sha256 !== '27b22368434e94278d4cfee238770339f8e90da6229ef9ffd95900c4972426e5')
  throw new Error('Reference file checksum mismatch');
const groups = {
  verbal: ['VR.04', 'VR.16', 'VR.17', 'VR.19'],
  series: ['LN.07', 'LN.33', 'LN.34', 'LN.58'],
  matrix: ['MR.45', 'MR.46', 'MR.47', 'MR.55'],
  rotation: ['R3D.03', 'R3D.04', 'R3D.06', 'R3D.08'],
};
const items = Object.values(groups).flat();
// This pinned source contains simple numeric/NA cells and quoted headers/age bands, no embedded commas.
const rows = bytes
  .toString('utf8')
  .trim()
  .split(/\r?\n/)
  .map((line) => line.split(',').map((value) => value.replace(/^"|"$/g, '')));
const headers = rows.shift();
const columns = items.map((id) => headers.indexOf(id));
if (columns.some((i) => i < 0) || headers.indexOf('age') < 0)
  throw new Error('Unexpected dataset columns');
const complete = rows.filter((row) => columns.every((i) => row[i] === '0' || row[i] === '1'));
if (rows.length !== 96958 || complete.length !== 4574)
  throw new Error('Reference dataset changed; review before rebuilding');
const adultBands = ['19to24', '25to29', '30to34', '35to39', '40to49', '50to59', '60andOver'];
const adults = complete.filter((row) => adultBands.includes(row[headers.indexOf('age')]));
if (adults.length !== 3480) throw new Error('Unexpected adult cohort');
const frequencies = {};
for (const [group, ids] of Object.entries({ ...groups, overall: items })) {
  const counts = Array(ids.length + 1).fill(0);
  for (const row of adults)
    counts[ids.reduce((n, id) => n + Number(row[headers.indexOf(id)]), 0)]++;
  const mean = counts.reduce((n, count, score) => n + count * score, 0) / adults.length;
  const sd = Math.sqrt(
    counts.reduce((n, count, score) => n + count * (score - mean) ** 2, 0) / (adults.length - 1),
  );
  frequencies[group] = { items: ids, counts, mean, sd };
}
const output = {
  id: 'icar16-sapa-adult-v1',
  source: 'https://doi.org/10.7910/DVN/AD9RVY',
  datasetVersion: '3.0',
  fileId: 10991957,
  sha256,
  license: 'CC0-1.0',
  collected: '2010-08-18 to 2013-05-20',
  totalRecords: rows.length,
  completeRecords: complete.length,
  n: adults.length,
  ageBands: adultBands,
  excludedAgeBand: '18andUnder',
  scale: { mean: 100, sd: 15 },
  frequencies,
};
const target = new URL('../src/content/icar-reference.json', import.meta.url);
const json = JSON.stringify(output, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (JSON.stringify(JSON.parse(await readFile(target, 'utf8'))) !== JSON.stringify(output))
    throw new Error('Committed reference differs from source');
} else await writeFile(target, json);
console.log(
  `ICAR reference verified: ${adults.length} adults, ${complete.length} complete records; SHA-256 ${output.sha256}`,
);
