import { execSync } from 'child_process';
import { mkdir, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import * as files from './project-files';
import { log, detectPackageManager, writeProjectFile } from './utils';
import { makeDummyContent } from './dummy-content-maker';

interface Data {
  name: string;
  base: string;
  colors: string;
  sections: number;
  noNumbering: boolean;
  goDeep: string;
}

export async function setupProject(data: Data) {
  const projectPath = path.join(process.cwd(), data.name);
  const packageManager = detectPackageManager();
  const projectDirName = path.basename(projectPath);

  await mkdir(projectPath);
  log(
    `\nCreating a new Neotoc Playground in ${chalk.green.italic(projectPath)}.`,
  );
  log(`\nCreating ${chalk.cyan.italic('package.json')}.`);
  await writeProjectFile(
    projectPath,
    files.packageJson({ name: projectDirName }),
  );

  log(chalk.bold(`\nUsing ${packageManager}.\n`));

  log('Installing dependencies:');
  log(`- ${chalk.cyan.italic('neotoc')}`);

  log('\nInstalling devDependencies:');
  log(`- ${chalk.cyan.italic('prettier')}`);
  log(`- ${chalk.cyan.italic('browser-sync')}`);
  log(`- ${chalk.cyan.italic('neotoc-playground')}`);

  execSync(`${packageManager} install`, { cwd: projectPath, stdio: 'inherit' });

  const bgColors = await extractCssBg(projectPath);
  const bgDark = bgColors[data.colors]?.bgDark;
  const bgLight = bgColors[data.colors]?.bgLight;

  if (bgDark === undefined || bgLight === undefined)
    throw new Error('Background color not found');

  const otherFilesToCreate = [
    files.neotocPlaygroundJson({
      sections: data.sections,
      goDeep: data.goDeep,
      numbering: !data.noNumbering,
    }),
    files.gitignore(),
    files.prettierrc(),
    files.prettierIgnore(),
    files.indexHtml({
      content: makeDummyContent({
        sections: data.sections,
        goDeep: data.goDeep,
        noNumbering: data.noNumbering,
      }),
      base: data.base,
      colors: data.colors,
    }),
    files.indexJs(),
    files.globalCss({
      bgDark: bgDark,
      bgLight: bgLight,
    }),
  ];

  log('\nCreating files:');
  for (const file of otherFilesToCreate) {
    await writeProjectFile(projectPath, file);
    log(`- ${chalk.cyan.italic(file.name)}`);
  }

  log('\nPrettifying:');
  execSync(`${packageManager} run format`, {
    cwd: projectPath,
    stdio: 'inherit',
  });

  log(chalk.bold('\nDone!'));
  log(chalk('Now run the following to start the dev server:\n'));
  log(chalk.green(`cd ${data.name}`));
  log(chalk.green(`${packageManager} run dev\n`));
}

interface ColorsBG {
  [x: string]: {
    bgLight: string;
    bgDark: string;
  };
}

async function extractCssBg(projectPath: string) {
  const distPath = path.join(projectPath, 'node_modules', 'neotoc', 'dist');
  const colorsFiles = (await readdir(distPath)).filter((n) =>
    /^colors-\w+\.css$/.test(n),
  );
  const result = <ColorsBG>{};
  for (const file of colorsFiles) {
    const colorsName = file.match(/colors-(.+).css$/)?.[1];
    if (colorsName) {
      const fileContent = await readFile(path.join(distPath, file), 'utf8');
      const regex = /(\.dark )?\.nt-widget.+?--bg:(#\w+)/g;
      [...fileContent.matchAll(regex)].forEach((match) => {
        if (result[colorsName] == undefined) {
          result[colorsName] = <{ bgLight: string; bgDark: string }>{};
        }
        if (match[1]) result[colorsName].bgDark = match[2]!;
        else result[colorsName].bgLight = match[2]!;
      });
    } else {
      throw new Error('CSS file not following the convention.');
    }
  }
  return result;
}
