import process from 'node:process';
import chalk from 'chalk';
import { parseCliArgs } from './parse-args';
import {
  logError,
  checkFileExists,
  exitIfNestingPlaygrounds,
  printSeeHelpText,
} from './utils';
import { startPrompts } from './prompts';
import { flagAliases } from './parse-args';

// it reads, validates and returns the final resolved user inputs
export async function resolveInputs() {
  const parsedArgs = parseCliArgs();
  let result = parsedArgs.args;

  if (parsedArgs.noArgs) {
    exitIfNestingPlaygrounds();
    result = await startPrompts();
  } else {
    const unknownValueOfFlags = Object.entries(parsedArgs.unknownValueOfFlags);

    if (parsedArgs.missingFlags.length) {
      if (
        parsedArgs.args.help !== undefined ||
        parsedArgs.args.version !== undefined
      ) {
        return parsedArgs.args;
      }

      parsedArgs.missingFlags.forEach((missingFlag) => {
        logError(`--${chalk.italic(missingFlag)} flag is missing.`);
      });
      printSeeHelpText();
      process.exit(1);
    }

    exitIfNestingPlaygrounds();

    if (parsedArgs.flagsMissingValue.length) {
      parsedArgs.flagsMissingValue.forEach((flag) => {
        logError(
          `No value provided to --${chalk.italic(flag)}(or -${chalk.italic(flagAliases[flag]![0])}).`,
        );
      });
      printSeeHelpText();
      process.exit(1);
    }

    if (parsedArgs.flagsGotMultipleValues.length) {
      parsedArgs.flagsGotMultipleValues.forEach((flag) => {
        logError(
          `Repetition of --${chalk.italic(flag)}(or -${chalk.italic(flagAliases[flag]![0])}) flag is not allowed.`,
        );
      });
      printSeeHelpText();
      process.exit(1);
    }

    if (checkFileExists(parsedArgs.args.name as string)) {
      logError(
        `Cannot create directory "${chalk.italic(parsedArgs.args.name)}": File exists.`,
      );
      printSeeHelpText();
      process.exit(1);
    }

    if (unknownValueOfFlags.length) {
      unknownValueOfFlags.forEach(([flag, unknownValue]) => {
        logError(
          `--${chalk.italic(flag)}(or -${chalk.italic(flagAliases[flag]![0])}) flag got unknown value "${chalk.italic(unknownValue)}".`,
        );
      });
      printSeeHelpText();
      process.exit(1);
    }
    if (parsedArgs.unknownFlags.length) {
      parsedArgs.unknownFlags.forEach((flag) => {
        logError(
          `${flag.length === 1 ? '-' : '--'}${chalk.italic(flag)} flag is unknown.`,
        );
      });
      printSeeHelpText();
      process.exit(1);
    }
    if (parsedArgs.unknownArgs.length) {
      parsedArgs.unknownArgs.forEach((arg) => {
        logError(`Unknown argument ${chalk.italic(arg)}.`);
      });
      printSeeHelpText();
      process.exit(1);
    }

    if (typeof parsedArgs.args.sections !== 'number') {
      logError(
        `--${chalk.italic('sections')}(or -${chalk.italic('s')}) must be a number.`,
      );
      printSeeHelpText();
      process.exit(1);
    } else if (
      !(
        Number.isInteger(parsedArgs.args.sections) &&
        parsedArgs.args.sections >= 0
      )
    ) {
      logError(
        `--${chalk.italic('sections')}(or -${chalk.italic('s')}) must be a non-negative integer.`,
      );
      printSeeHelpText();
      process.exit(1);
    }
  }
  return result;
}
