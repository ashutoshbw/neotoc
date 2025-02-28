import process from 'node:process';
import { generateNewFolderName, checkFileExists } from './utils';
import { input, select, confirm } from '@inquirer/prompts';
import chalk from 'chalk';

export async function startPrompts() {
  const userInput = <
    {
      name: string;
      base: string;
      colors: string;
      sections: number;
      noNumbering: boolean;
      goDeep: string;
    }
  >{};

  try {
    userInput.name = await input({
      message: 'Name your playground:',
      default: generateNewFolderName('neotoc-playground'),
      validate(value) {
        if (value == '') {
          return 'Name is not given.';
        }
        if (checkFileExists(value)) {
          return 'File already exists of same name.';
        } else return true;
      },
      transformer(text) {
        return chalk.cyan.bold.italic(text.trim());
      },
      theme: {
        style: {
          answer(text: string) {
            return chalk.cyan.bold.italic(text.trim());
          },
          defaultAnswer(text: string) {
            return chalk.gray.bold.italic(`${text}`);
          },
        },
      },
    });

    userInput.base = await select({
      message: `What ${chalk.italic('base style')} do you want to have for TOC?`,
      choices: [
        {
          value: 'plain',
          name: '  Plain',
        },
        {
          value: 'modern',
          name: '  Modern',
        },
      ],
      default: 'modern',
      theme: {
        style: {
          answer(text: string) {
            return chalk.gray.bold(`→ `) + chalk.cyan.bold.italic(text.trim());
          },
          help() {
            return chalk.gray('Use arrow-keys. Enter to submit.');
          },
          highlight(t: string) {
            const prefix = t.charAt(0);
            const optionName = t.slice(4);
            const descriptions: { [x: string]: string } = {
              plain: 'No rounded corners and subtle decorative styles.',
              modern: 'Rounded corners with some subtle decorative styles.',
            };
            return `  ${chalk.cyan(prefix)} ${chalk.cyan.bold.italic(optionName)}${chalk.gray(': ' + descriptions[optionName.toLowerCase()])}`;
          },
        },
        helpMode: 'always',
      },
    });

    userInput.colors = await select({
      message: `What kind of ${chalk.italic('colors')} do you want for TOC?`,
      choices: [
        {
          value: 'monochrome',
          name: '  Monochrome',
        },
        {
          value: 'zinc',
          name: '  Zinc',
        },
        {
          value: 'slate',
          name: '  Slate',
        },
      ],
      default: 'zinc',
      theme: {
        style: {
          answer(text: string) {
            return chalk.gray.bold(`→ `) + chalk.cyan.bold.italic(text.trim());
          },
          help() {
            return chalk.gray('Use arrow-keys. Enter to submit.');
          },
          highlight(t: string) {
            const prefix = t.charAt(0);
            const optionName = t.slice(4);
            const descriptions: { [x: string]: string } = {
              monochrome: 'Black and white.',
              zinc: `Based on TailwindCSS's zinc color palette.`,
              slate: `Based on TailwindCSS's slate color palette.`,
            };
            return `  ${chalk.cyan(prefix)} ${chalk.cyan.bold.italic(optionName)}${chalk.gray(': ' + descriptions[optionName.toLowerCase()])}`;
          },
        },
        helpMode: 'always',
      },
    });

    userInput.sections = +(await input({
      message: `${chalk.italic('Number')} of sections to be generated:`,
      default: '25',
      validate(value) {
        const count = Number(value);
        if (value.trim().length === 0) {
          return 'You must provide a number to continue';
        }
        if (!Number.isNaN(count)) {
          if (!(Number.isInteger(count) && count >= 0))
            return 'Value must be an integer between 0 and Infinity.';
          else return true;
        }
        return 'You must provide a valid number to continue.';
      },
      transformer(text) {
        return chalk.cyan.bold.italic(text.trim());
      },
      theme: {
        style: {
          answer(text: string) {
            return chalk.cyan.bold.italic(text.trim());
          },
          defaultAnswer(text: string) {
            return chalk.gray.bold.italic(`${text}`);
          },
        },
      },
    }));

    userInput.goDeep = await select({
      message: `How ${chalk.italic('often')} do you want to have ${chalk('nested sections')}?`,
      choices: [
        {
          value: 'never',
          name: '  Never',
        },
        {
          value: 'rarely',
          name: '  Rarely',
        },
        {
          value: 'sometimes',
          name: '  Sometimes',
        },
        {
          value: 'often',
          name: '  Often',
        },
        {
          value: 'always',
          name: '  Always',
        },
      ],
      default: 'sometimes',
      theme: {
        style: {
          answer(text: string) {
            return chalk.gray.bold(`→ `) + chalk.cyan.bold.italic(text.trim());
          },
          help() {
            return chalk.gray('Use arrow-keys. Enter to submit.');
          },
          highlight(t: string) {
            const prefix = t.charAt(0);
            const optionName = t.slice(4);
            return `  ${chalk.cyan(prefix)} ${chalk.cyan.bold.italic(optionName)}`;
          },
        },
        helpMode: 'always',
      },
    });

    userInput.noNumbering = !(await confirm({
      message: `Show ${chalk.italic('hierarchical numbering')} in front of section headings?`,
      default: true,
      theme: {
        style: {
          answer(text: string) {
            return chalk.gray.bold(`→ `) + chalk.cyan.bold.italic(text.trim());
          },
        },
      },
    }));
  } catch (error) {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      // noop; silence this error
      console.log('\nCancelled creating the playground 👋 until next time!');
      process.exit(0);
    } else {
      throw error;
    }
  }

  return userInput;
}
