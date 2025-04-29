import path from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import {
  checkFileExists,
  detectPackageManager,
  drawBorderedBoxInPrompts,
  generateNewDirName,
} from './utils';
import { createPlayground } from './create-playground';

export async function startPrompts() {
  p.intro(`Let's create a neotoc playground!`);
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
            {
              value: 'modern',
              label: 'Modern',
              hint: 'Rounded corners with some subtle decorative styles',
            },
            {
              value: 'plain',
              label: 'Plain',
              hint: 'No rounded corners and subtle decorative styles',
            },
          ],
        }),
      colors: () =>
        p.select({
          message: 'Pick color scheme:',
          options: [
            {
              value: 'zinc',
              label: 'Zinc',
              hint: `Based on TailwindCSS's zinc color palette`,
            },
            {
              value: 'slate',
              label: 'Slate',
              hint: `Based on TailwindCSS's slate color palette`,
            },
            {
              value: 'monochrome',
              label: 'Monochrome',
              hint: 'Black and white',
            },
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
  p.log.step(`Creating playground in ${path.join(process.cwd(), group.name)}`);
  const packageManager = detectPackageManager();
  await createPlayground(group.name, group.base, group.colors, packageManager);
  drawBorderedBoxInPrompts('Done ✨ Now run', [
    `cd ${group.name}`,
    `${packageManager} install`,
    `${packageManager} run dev`,
  ]);
  p.outro(
    `Problems? ${pc.underline(pc.blue('https://github.com/ashutoshbw/neotoc/issues'))}`,
  );
}
