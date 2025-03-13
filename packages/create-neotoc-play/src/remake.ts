#!/usr/bin/env node
import { readFile } from 'fs/promises';
import { parse } from 'node-html-parser';
import { makeDummyContent } from './dummy-content-maker';
import { execSync } from 'node:child_process';
import process from 'node:process';
import { writeProjectFile, logError } from './utils';
import { z } from 'zod';

const goDeepAllowedValues = ['never', 'rarely', 'sometimes', 'often', 'always'];
const configSchema = z.object({
  sections: z.number().int().nonnegative().default(25),
  goDeep: z
    .string()
    .default('sometimes')
    .refine(
      (value) =>
        goDeepAllowedValues.some(
          (item) => item.toLowerCase() === value.toLowerCase(),
        ),
      (v) => ({
        message: `Expected one of: ${goDeepAllowedValues.join(', ')}. Received '${v}'`,
      }),
    ),
  numbering: z.boolean().default(true),
  minWordsPerHeading: z.number().int().gt(0).default(1),
  maxWordsPerHeading: z.number().int().gt(0).default(6),
  minWordsPerSentence: z.number().int().gt(0).default(4),
  maxWordsPerSentence: z.number().int().gt(0).default(16),
  minSentencesPerParagraph: z.number().int().gt(0).default(4),
  maxSentencesPerParagraph: z.number().int().gt(0).default(8),
  minParagraphsPerSection: z.number().int().nonnegative().default(1),
  maxParagraphsPerSection: z.number().int().nonnegative().default(8),
  sometimesHaveNoParagraphsInParentSections: z.boolean().default(true),
});

const configJson = JSON.parse(await readFile('neotoc-playground.json', 'utf8'));
const parsedConfig = configSchema.safeParse(configJson);

if (parsedConfig.success) {
  const data = parsedConfig.data;
  const html = await readFile('index.html', 'utf8');

  const root = parse(html);
  const dummyContentDiv = root.querySelector('#dummy-content');

  if (dummyContentDiv) {
    dummyContentDiv.innerHTML = makeDummyContent({
      sections: data.sections,
      goDeep: data.goDeep,
      noNumbering: !data.numbering,
      minWordsPerHeading: data.minWordsPerHeading,
      maxWordsPerHeading: data.maxWordsPerHeading,
      minWordsPerSentence: data.minWordsPerSentence,
      maxWordsPerSentence: data.maxWordsPerSentence,
      minSentencesPerParagraph: data.minSentencesPerParagraph,
      maxSentencesPerParagraph: data.maxSentencesPerParagraph,
      minParagraphsPerSection: data.minParagraphsPerSection,
      maxParagraphsPerSection: data.maxParagraphsPerSection,
      sometimesHaveNoParagraphsInParentSections:
        data.sometimesHaveNoParagraphsInParentSections,
    });
  }

  await writeProjectFile(process.cwd(), {
    name: 'index.html',
    content: root.toString(),
  });

  execSync(`prettier --write index.html`, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
} else {
  logError('neotoc-playgroud.json', false);
  for (const issue of parsedConfig.error.issues) {
    logError(`  "${issue.path[0]}": ${issue.message}`, false);
  }
}
