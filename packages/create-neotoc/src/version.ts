import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { NEOTOC_VERSION } from './constants';
import { log } from './utils';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

export const versionData = {
  neotoc: NEOTOC_VERSION,
  neotocPlayground: packageJson.version,
};

export function printVersion() {
  log(`\
${chalk.bold('neotoc-playground v' + versionData.neotocPlayground)}
Uses ${'neotoc v' + versionData.neotoc}`);
}
