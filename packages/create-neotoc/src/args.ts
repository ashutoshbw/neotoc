import path from 'node:path';
import { parseArgs as pa, type ParseArgsConfig } from 'node:util';
import { checkFileExists } from './utils';

const baseOptions = ['plain', 'modern'];
const colorsOptions = ['monochrome', 'zinc', 'slate'];

const argsConfig: ParseArgsConfig = {
  options: {
    base: { type: 'string', short: 'b' },
    colors: { type: 'string', short: 'c' },
    help: { type: 'boolean', short: 'h' },
    version: { type: 'boolean', short: 'v' },
  },
  allowPositionals: true,
};

interface Args {
  dirname?: string;
  base?: string;
  colors?: string;
  help?: boolean;
  version?: boolean;
}

export function parseArgs() {
  try {
    const parsedArgs = pa(argsConfig);
    const result: Args = {
      dirname: parsedArgs.positionals[0],
      base: parsedArgs.values.base as string,
      colors: parsedArgs.values.colors as string,
      help: parsedArgs.values.help as boolean,
      version: parsedArgs.values.version as boolean,
    };
    return result;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      process.exit(1);
    }
    throw err;
  }
}

export function validateArgs(args: Args) {
  if (args.dirname && checkFileExists(path.join(process.cwd(), args.dirname))) {
    console.error(`'${args.dirname}' already exists`);
    process.exit(1);
  }

  if (args.base && !baseOptions.includes(args.base)) {
    console.error(`Unknown value '${args.base}' for '--base, -b' option`);
    console.error(`Available values:\n- ${baseOptions.join('\n- ')}`);
    process.exit(1);
  }
  if (args.colors && !colorsOptions.includes(args.colors)) {
    console.error(`Unknown value '${args.colors}' for '--colors, -c' option`);
    console.error(`Available values:\n- ${colorsOptions.join('\n- ')}`);
    process.exit(1);
  }

  return args;
}
