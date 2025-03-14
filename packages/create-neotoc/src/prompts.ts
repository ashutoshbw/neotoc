import path from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import {
  checkFileExists,
  detectPackageManager,
  drawBorderedBoxInPrompts,
  generateNewDirName,
} from './utils';
import { scaffoldPlayground } from './scaffold-playground';

export async function startPrompts() {
  const defaultDirName = generateNewDirName('neotoc-playground');
  const group = await p.group(
    {
      name: () =>
        p.text({
          message: 'Playground name:',
          placeholder: defaultDirName,
          validate(value) {
            const valueTrimmed = value.trim();
            if (value.length > 0 && valueTrimmed === '') {
              return 'Sorry, just spaces will not work!';
            }
            if (value === '') return;
            if (checkFileExists(path.join(process.cwd(), valueTrimmed))) {
              return `'${valueTrimmed}' already exists!`;
            }
            return;
          },
        }),
      base: () =>
        p.select({
          message: 'Pick base style:',
          options: [
            { value: 'modern', label: 'Modern' },
            { value: 'plain', label: 'Plain' },
          ],
        }),
      colors: () =>
        p.select({
          message: 'Pick colorscheme:',
          options: [
            { value: 'zinc', label: 'Zinc' },
            { value: 'slate', label: 'Slate' },
            { value: 'monochrome', label: 'Monochrome' },
          ],
        }),
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.');
        process.exit(0);
      },
    },
  );
  group.name = group.name === undefined ? defaultDirName : group.name.trim();
  p.log.step(
    `Scaffolding playground in ${path.join(process.cwd(), group.name)}`,
  );
  const packageManager = detectPackageManager();
  await scaffoldPlayground(
    group.name,
    group.base,
    group.colors,
    packageManager,
  );
  drawBorderedBoxInPrompts('Done 😊 Now run', [
    `cd ${group.name}`,
    `${packageManager} install`,
    `${packageManager} run dev`,
  ]);
  p.outro(
    `Problems? ${pc.underline(pc.blue('https://github.com/ashutoshbw/neotoc/issues'))}`,
  );
}
