#!/usr/bin/env node
import path from 'node:path';
import pc from 'picocolors';
import { validateArgs, parseArgs } from './args';
import { startPrompts } from './prompts';
import { printHelp } from './help';
import { printVersion } from './version';
import { generateNewDirName, detectPackageManager } from './utils';
import { scaffoldPlayground } from './scaffold-playground';

const args = validateArgs(parseArgs());
if (Object.values(args).every((v) => v === undefined)) {
  startPrompts();
} else {
  if (args.help) {
    printHelp();
  } else if (args.version) {
    printVersion();
  } else {
    const dirname = args.dirname
      ? args.dirname
      : generateNewDirName('neotoc-playground');
    const base = args.base || 'modern';
    const colors = args.colors || 'zinc';
    const packageManager = detectPackageManager();
    console.log(
      `Scaffolding playground in ${path.join(process.cwd(), dirname)}`,
    );
    await scaffoldPlayground(dirname, base, colors, packageManager);
    console.log('\nDone 😊 Now run:\n');
    console.log(pc.greenBright(`cd ${dirname}`));
    console.log(pc.greenBright(`${packageManager} install`));
    console.log(pc.greenBright(`${packageManager} run dev\n`));
    console.log(
      `Problems? ${pc.underline(pc.blue('https://github.com/ashutoshbw/neotoc/issues'))}`,
    );
  }
}

// console.log(r);
