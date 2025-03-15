import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { copyDir } from './utils';

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

  copyDir(templateDir, targetDir, ['package.json', 'main.js']);

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
  );
  pkg.name = path.basename(dir);
  fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify(pkg, null, 2) + '\n',
  );

  const mainJS = fs
    .readFileSync(path.join(templateDir, 'src', `main.js`), 'utf-8')
    .replace('base-?', `base-${base}`)
    .replace('colors-?', `colors-${colors}`);
  fs.writeFileSync(path.join(targetDir, 'src', 'main.js'), mainJS);
}
