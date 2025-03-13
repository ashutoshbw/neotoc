#!/usr/bin/env node

import { z } from 'zod';
import { resolveInputs } from './resolve-inputs';
import { setupProject } from './setup-project';
import { logError } from './utils';
import { printHelp } from './help';
import { printVersion } from './version';

const inputs = await resolveInputs();

if (typeof inputs.name === 'string') {
  const userInputSchema = z.object({
    name: z.string(),
    base: z.string(),
    colors: z.string(),
    sections: z.number(),
    noNumbering: z.boolean(),
    goDeep: z.string(),
  });

  const parsedInputs = userInputSchema.safeParse(inputs);

  if (parsedInputs.success) {
    await setupProject(parsedInputs.data);
  } else {
    logError(
      'Parsing user input failed unexpectedly. Please open an issue on Github about it.',
    );
  }
}

if (typeof inputs.help != 'undefined') {
  printHelp();
}
if (typeof inputs.version != 'undefined') {
  printVersion();
}
