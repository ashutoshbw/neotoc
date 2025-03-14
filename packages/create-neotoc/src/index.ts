#!/usr/bin/env node

import { parseArgs, validateArgs } from './parse-args';

const r = parseArgs();
validateArgs(r);

// console.log(r);
