import { writeFile } from 'node:fs/promises';
import { statSync } from 'node:fs';
import path from 'node:path';
import { join } from 'node:path';
import process from 'node:process';
import chalk from 'chalk';
import { type ProjectFile } from './project-files';

export async function writeProjectFile(projectDir: string, file: ProjectFile) {
  await writeFile(join(projectDir, file.name), file.content);
}

export function getPkgRunner(pkgManager: string) {
  const map: { [x: string]: string } = {
    npm: 'npx',
    pnpm: 'pnpx',
    yarn: 'yarn dlx',
    bun: 'bunx',
  };
  const result = map[pkgManager];
  if (result) return result;
  throw new Error(`Unknown package manager: ${pkgManager}`);
}

export function log(...values: unknown[]) {
  console.log(...values);
}

export function logError(msg: string, err = true) {
  log(
    (err ? chalk.bold.red('Error') : '') + chalk.red((err ? ': ' : '') + msg),
  );
}

export function checkFileExists(fileName: string, parentPath = process.cwd()) {
  const pathOfFile = path.join(parentPath, fileName);
  try {
    statSync(pathOfFile);
    return true;
  } catch {
    return false;
  }
}

export function generateNewFolderName(prefix: string) {
  if (!checkFileExists(prefix)) return prefix;
  let num = 1;
  while (checkFileExists(`${prefix}-${num}`)) {
    num++;
  }
  return `${prefix}-${num}`;
}

export function detectPackageManager() {
  const validPkgManagers = ['npm', 'pnpm', 'yarn', 'bun'];
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent && userAgent.indexOf('/') !== -1) {
    const pkgManager = userAgent.slice(0, userAgent.indexOf('/'));
    if (validPkgManagers.includes(pkgManager)) {
      return pkgManager;
    } else {
      throw new Error(`Unknown package manager: ${pkgManager}`);
    }
  }
  throw new Error(`Package manager not found`);
}

export function exitIfNestingPlaygrounds() {
  if (checkFileExists('neotoc-playground.json')) {
    logError(
      `Found "${chalk.italic('neotoc-playground.json')}". Most likely you are already inside a neotoc playground! Nesting neotoc playgrounds is not recommended. Cancelled operation.`,
    );
    process.exit(1);
  }
}

export function printSeeHelpText() {
  const pkgRunner = getPkgRunner(detectPackageManager());

  log('\nSee help by entering:');
  log(`    ${pkgRunner} neotoc-playground --help`);
}
