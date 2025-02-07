import chokidar from 'chokidar';
import { exec } from 'node:child_process';
import { basename, sep } from 'node:path';
import { unlink } from 'node:fs';
import chalk from 'chalk';
import { fixCSSSourceMap } from './css-sourcemap.js';

chokidar.watch('./src/styles').on('all', (event, path) => {
  const distPath = `dist${sep}${basename(path)}`;
  if (event == 'add' || event == 'change') {
    exec(
      `pnpm exec lightningcss --minify --sourcemap --targets ">= 0.25%" ${path} -d dist`,
      (error, stdout, stderr) => {
        if (error === null) {
          fixCSSSourceMap(distPath);
          console.log(chalk.greenBright(`${path} → ${distPath}`));
        } else {
          if (stderr) throw stderr;
          throw error;
        }
        if (stdout) console.log(stdout);
      },
    );
  } else if (event == 'unlink') {
    unlink(`dist${sep}${basename(path)}`, (err) => {
      if (err) throw err;
      console.log(chalk.red(`${path} removed → ${distPath} removed`));
    });
  }
});
