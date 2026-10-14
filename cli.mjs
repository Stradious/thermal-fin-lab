import { readFile, writeFile } from 'node:fs/promises';
import { analyzeFin, finSvg } from './fin.mjs';
const file = process.argv[2];
if (!file) { console.error('Usage: node thermal-fin-lab/cli.mjs path/to/input.json'); process.exit(1); }
try {
  const input = JSON.parse(await readFile(file, 'utf8'));
  const result = analyzeFin(input);
  const output = file.replace(/\.json$/i, '') + '-result.svg';
  await writeFile(output, finSvg(result));
  console.log(JSON.stringify({ heatWatts: result.heatWatts, efficiency: result.efficiency, tipTemperatureC: result.tipTemperature, diagram: output }, null, 2));
} catch (error) { console.error(error.message); process.exitCode = 1; }
