import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { copyDir } from './utils';
import { NEOTOC_VERSION } from './constants';

const bgColors: {
  [x: string]: {
    light: string;
    dark: string;
  };
} = {
  zinc: {
    light: 'hsl(0 0% 100%)',
    dark: 'hsl(240 10% 3.9%)',
  },
  slate: {
    light: 'hsl(210 40% 98%)',
    dark: 'hsl(222.2 84% 4.9%)',
  },
  monochrome: {
    light: 'hsl(0 0% 97%)',
    dark: 'hsl(0 0% 5%)',
  },
};

export async function scaffoldPlayground(
  dir: string,
  base: string,
  colors: string,
  packageManager: string,
) {
  const templateDir = path.join(
    fileURLToPath(import.meta.url),
    '..',
    '..',
    'template',
  );
  const targetDir = path.resolve(dir);

  copyDir(templateDir, targetDir, [
    'index.html',
    'package.json',
    'main.js',
    'base.css',
  ]);

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
  );
  pkg.name = path.basename(dir);
  pkg.dependencies.neotoc = NEOTOC_VERSION;
  fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify(pkg, null, 2) + '\n',
  );

  const indexHTML = fs
    .readFileSync(path.join(templateDir, `index.html`), 'utf-8')
    .replace('(NEOTOC_VERSION)', NEOTOC_VERSION)
    .replace(/\(packageManager\)/g, packageManager);
  fs.writeFileSync(path.join(targetDir, 'index.html'), indexHTML);

  const mainJS = fs
    .readFileSync(path.join(templateDir, 'src', `main.js`), 'utf-8')
    .replace('base-?', `base-${base}`)
    .replace('colors-?', `colors-${colors}`);
  fs.writeFileSync(path.join(targetDir, 'src', 'main.js'), mainJS);

  const baseCSS = fs
    .readFileSync(path.join(templateDir, 'src', `base.css`), 'utf-8')
    .replace('<bg-light>', bgColors[colors]?.light ?? 'white')
    .replace('<bg-dark>', bgColors[colors]?.dark ?? 'black');
  fs.writeFileSync(path.join(targetDir, 'src', 'base.css'), baseCSS);
}
