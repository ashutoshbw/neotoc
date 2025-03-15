import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import { NEOTOC_VERSION } from './constants';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

export const versionData = {
  neotoc: NEOTOC_VERSION,
  createNeotoc: packageJson.version,
};

export function printVersion() {
  console.log(`\
${pc.bold('create-neotoc v' + versionData.createNeotoc)}
Uses ${'neotoc v' + versionData.neotoc}`);
}
