import fs from 'node:fs';
import path from 'node:path';
import { fixCSSSourceMap } from './css-sourcemap.js';

const folderPath = 'dist';

fs.readdirSync(folderPath)
  .map((fileName) => {
    return path.join(folderPath, fileName);
  })
  .filter((path) => path.endsWith('.css'))
  .forEach((path) => fixCSSSourceMap(path));
