import { css } from './css';
import { html } from './html';
import { versionData } from './version';

export interface ProjectFile {
  name: string;
  content: string;
}

export function gitignore(): ProjectFile {
  return {
    name: '.gitignore',
    content: 'node_modules\ndist\n',
  };
}

export function prettierrc(): ProjectFile {
  return {
    name: '.prettierrc',
    content: '{}\n',
  };
}

export function prettierIgnore(): ProjectFile {
  return {
    name: '.prettierignore',
    content: '\n',
  };
}

export function neotocPlaygroundJson({
  sections,
  goDeep,
  numbering,
}: {
  sections: number;
  goDeep: string;
  numbering: boolean;
}): ProjectFile {
  return {
    name: 'neotoc-playground.json',
    content:
      JSON.stringify(
        {
          sections: sections,
          goDeep: goDeep,
          numbering: numbering,
          minWordsPerHeading: 1,
          maxWordsPerHeading: 6,
          minWordsPerSentence: 4,
          maxWordsPerSentence: 16,
          minSentencesPerParagraph: 4,
          maxSentencesPerParagraph: 8,
          minParagraphsPerSection: 1,
          maxParagraphsPerSection: 8,
          sometimesHaveNoParagraphsInParentSections: true,
        },
        null,
        2,
      ) + '\n',
  };
}

export function packageJson({ name }: { name: string }): ProjectFile {
  return {
    name: 'package.json',
    content:
      JSON.stringify(
        {
          name: name.toLowerCase(),
          version: '0.0.1',
          description:
            'Neotoc Playground—Simplest way to try out neotoc and make experiments.',
          scripts: {
            dev: 'browser-sync . -f index.html *.css *.js',
            preview: 'browser-sync dist -w',
            build: 'neotoc-playground-build',
            remake: 'neotoc-playground-remake',
            format: 'prettier --write .',
          },
          keywords: [],
          license: 'MIT',
          dependencies: {
            neotoc: versionData.neotoc,
          },
          devDependencies: {
            prettier: '3.5.1',
            'browser-sync': '^3.0.3',
            'neotoc-playground': versionData.neotocPlayground,
          },
        },
        null,
        2,
      ) + '\n',
  };
}

export function globalCss({
  bgLight,
  bgDark,
}: {
  bgLight: string;
  bgDark: string;
}): ProjectFile {
  return {
    name: 'global.css',
    content: css(bgLight, bgDark),
  };
}

export function indexJs(): ProjectFile {
  return {
    name: 'index.js',
    content: `function toggleTheme() {
  const currentTheme = localStorage.getItem("theme");
  applyTheme(currentTheme == "dark" ? "light" : "dark");
  document.documentElement.classList.add("disable-transitions");
  setTimeout(() => {
    document.documentElement.classList.remove("disable-transitions");
  }, 10);
}

const toggleThemeButton = document.getElementById("toggle-theme-btn");
toggleThemeButton.onclick = toggleTheme;

neotoc({
  io: "article >> h2,h3,h4,h5,h6 >> nav",
  ellipsis: true,
  offsetTop: 64,
});\n`,
  };
}

export function indexHtml({
  content,
  base,
  colors,
}: {
  content: string;
  base: string;
  colors: string;
}) {
  return {
    name: 'index.html',
    content: html(content, base, colors),
  };
}
