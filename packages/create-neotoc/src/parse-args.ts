import process from 'node:process';
import mri from 'mri';

interface ParsedArgs {
  missingFlags: string[];
  flagsMissingValue: string[];
  unknownFlags: string[];
  unknownArgs: string[];
  flagsGotMultipleValues: string[];
  unknownValueOfFlags: {
    [x: string]: unknown;
  };
  args: {
    [x: string]: unknown;
  };
  noArgs: boolean;
}

export const flagAliases: { [x: string]: string[] } = {
  name: ['n'],
  base: ['b'],
  colors: ['c'],
  'no-numbering': ['r'],
  sections: ['s'],
  'go-deep': ['d'],
  help: ['h'],
  version: ['v'],
};

export function parseCliArgs() {
  const mcqFlagValues: {
    [x: string]: string[];
  } = {
    base: ['modern', 'plain'],
    colors: ['zinc', 'slate', 'monochrome'],
    'go-deep': ['never', 'rarely', 'sometimes', 'often', 'always'],
  };

  const flagFullNames = Object.keys(flagAliases);

  const knownFlags = Object.entries(flagAliases)
    .map(([k, a]) => [k, ...a])
    .flat()
    .concat('_');

  const booleanFlags = ['help', 'version', 'no-numbering'];

  const parsedArgs: ParsedArgs = {
    missingFlags: [],
    flagsMissingValue: [],
    unknownFlags: [],
    unknownArgs: [],
    flagsGotMultipleValues: [],
    unknownValueOfFlags: {},
    args: {},
    noArgs: true,
  };

  const rawArgs = process.argv.slice(2);
  const mriArgs = mri(rawArgs, {
    default: {
      base: 'modern',
      colors: 'zinc',
      sections: 25,
      'no-numbering': false,
      'go-deep': 'sometimes',
    },
    alias: JSON.parse(JSON.stringify(flagAliases)),
    string: 'name',
    boolean: booleanFlags.slice(0),
  });

  if (rawArgs.length > 0) {
    parsedArgs.noArgs = false;
    if (mriArgs.name === undefined) {
      parsedArgs.missingFlags.push('name');
    } else if (Array.isArray(mriArgs.name)) {
      parsedArgs.flagsGotMultipleValues.push('name');
    } else if (mriArgs.name.length == 0) {
      parsedArgs.flagsMissingValue.push('name');
    }
  }

  parsedArgs.unknownArgs = mriArgs._;

  Object.keys(mriArgs).forEach((flag) => {
    if (!knownFlags.includes(flag)) {
      parsedArgs.unknownFlags.push(flag);
    }
  });

  Object.entries(mcqFlagValues).forEach(([flag, validValues]) => {
    if (Object.prototype.hasOwnProperty.call(mriArgs, flag)) {
      const recievedValue = mriArgs[flag];
      if (Array.isArray(recievedValue)) {
        parsedArgs.flagsGotMultipleValues.push(flag);
      } else if (recievedValue !== '') {
        if (!validValues.includes(recievedValue)) {
          parsedArgs.unknownValueOfFlags[flag] = recievedValue;
        }
      } else {
        parsedArgs.flagsMissingValue.push(flag);
      }
    }
  });

  booleanFlags.forEach((flag) => {
    if (Object.prototype.hasOwnProperty.call(mriArgs, flag)) {
      const recievedValue = mriArgs[flag];
      if (Array.isArray(recievedValue)) {
        parsedArgs.flagsGotMultipleValues.push(flag);
      }
    }
  });

  flagFullNames.forEach((flag) => {
    if (flag === 'go-deep') {
      parsedArgs.args.goDeep = mriArgs[flag];
    } else if (flag === 'no-numbering') {
      parsedArgs.args.noNumbering = mriArgs[flag];
    } else {
      parsedArgs.args[flag] = mriArgs[flag];
    }
  });

  return parsedArgs;
}
