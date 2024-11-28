import { it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import neotoc from '../src/index';

const haveHeadingsMarkupPath = path.join(
  process.cwd(),
  'test',
  'html',
  'have-headings.html',
);
const noHeadingsMarkupPath = path.join(
  process.cwd(),
  'test',
  'html',
  'no-headings.html',
);
const haveHeadingsMarkup = fs.readFileSync(haveHeadingsMarkupPath).toString();
const noHeadingsMarkup = fs.readFileSync(noHeadingsMarkupPath).toString();

it('should append the toc widget if headings are found', () => {
  document.body.innerHTML = haveHeadingsMarkup;
  const toc = neotoc({ io: 'article >> h* >> .toc-widget' });
  const aside = document.querySelector('.toc-widget');
  const neotocWidget = aside?.firstChild;

  expect(neotocWidget).toBeTruthy();

  toc.remove();
});

it('should append nothing if no headings are found', () => {
  document.body.innerHTML = noHeadingsMarkup;
  const aside = document.querySelector('.toc-widget');
  const toc = neotoc({ io: 'article >> h* >> .toc-widget' });

  expect(aside?.innerHTML).toBe('');

  toc.remove();
});

it('should throw an error if no target element is found to append the toc widget', () => {
  document.body.innerHTML = haveHeadingsMarkup;

  function resultFn() {
    neotoc({ io: 'article >> h* >> .does-not-exist' });
  }

  expect(resultFn).toThrow('Nothing was found to append Neotoc to!');
});
