#!/usr/bin/env node
import {
  readFile,
  mkdir,
  readdir,
  copyFile,
  writeFile,
  rm,
} from 'node:fs/promises';
import { join, basename } from 'node:path';
import process from 'node:process';
import { parse } from 'node-html-parser';
import { checkFileExists } from './utils';

await rm(join(process.cwd(), 'dist'), { recursive: true, force: true });

const filesToIgnore = [
  'package.json',
  'package-lock.json',
  'pnpm-lock.json',
  'yarn.lock',
  '.gitignore',
  'dist',
  'node_modules',
  'neotoc-playground.json',
  '.prettierignore',
  '.prettierrc',
].map((filename) => join(process.cwd(), filename));

async function copyDirectory(src: string, dest: string) {
  await mkdir(dest, { recursive: true });

  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    if (filesToIgnore.includes(srcPath)) continue;

    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

await copyDirectory(process.cwd(), join(process.cwd(), 'dist'));

function getUniqueNeotocBuildDirName() {
  let guessName = 'neotoc';
  const genName = () =>
    `neotoc-${(+Math.random().toString().slice(2)).toString(16)}`;
  while (checkFileExists(guessName, join(process.cwd(), 'dist'))) {
    guessName = genName();
  }
  return guessName;
}

const neotocBuildDirName = getUniqueNeotocBuildDirName();
const html = await readFile('index.html', 'utf8');
const root = parse(html);
const refs = root.querySelectorAll(
  `script[src^="node_modules/neotoc/dist/"], link[href^="node_modules/neotoc/dist/"]`,
);
const filesToCopyFromNeotoc: string[] = [];
if (refs.length) {
  const neotocDistPath = join(process.cwd(), 'node_modules', 'neotoc', 'dist');
  for (const refElt of refs) {
    if (refElt.tagName === 'SCRIPT') {
      let updatedSrc = refElt.getAttribute('src');
      if (updatedSrc) {
        updatedSrc = updatedSrc.replace(
          'node_modules/neotoc/dist',
          neotocBuildDirName,
        );
        refElt.setAttribute('src', updatedSrc);
        filesToCopyFromNeotoc.push(join(neotocDistPath, basename(updatedSrc)));
        filesToCopyFromNeotoc.push(
          join(neotocDistPath, basename(updatedSrc) + '.map'),
        );
      }
    } else if (refElt.tagName === 'LINK') {
      let updatedHref = refElt.getAttribute('href');
      if (updatedHref) {
        updatedHref = updatedHref.replace(
          'node_modules/neotoc/dist',
          neotocBuildDirName,
        );
        refElt.setAttribute('href', updatedHref);
        filesToCopyFromNeotoc.push(join(neotocDistPath, basename(updatedHref)));
        filesToCopyFromNeotoc.push(
          join(neotocDistPath, basename(updatedHref) + '.map'),
        );
      }
    }
  }
}

const destPath = join(process.cwd(), 'dist', neotocBuildDirName);
await mkdir(destPath, { recursive: true });
for (const sourceFilePath of filesToCopyFromNeotoc) {
  await copyFile(sourceFilePath, join(destPath, basename(sourceFilePath)));
}

const indexHtmlPath = join(process.cwd(), 'dist', 'index.html');
await writeFile(indexHtmlPath, root.toString());
