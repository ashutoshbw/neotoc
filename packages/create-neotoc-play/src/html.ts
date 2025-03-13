import { versionData } from './version';

export function html(content: string, base: string, colors: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="A simple web page to play with Neotoc." />
    <meta name="generator" content="neotoc-playground v${versionData.neotocPlayground}">
    <title>Neotoc Playground</title>
    <script>
      function getPreferredTheme() {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) return storedTheme;
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }

      function applyTheme(theme) {
        localStorage.setItem("theme", theme);
        document.documentElement.classList.add(theme);
        document.documentElement.style.colorScheme = theme;
        document.documentElement.classList.remove(
          theme == "dark" ? "light" : "dark",
        );
      }

      applyTheme(getPreferredTheme());
    </script>
    <script defer src="node_modules/neotoc/dist/index.umd.js"></script>
    <link rel="stylesheet" href="node_modules/neotoc/dist/base-${base}.css" />
    <link rel="stylesheet" href="node_modules/neotoc/dist/colors-${colors}.css" />
    <script defer src="index.js"></script>
    <link rel="stylesheet" href="global.css" />
  </head>
  <body>
    <header>
      <div class="header-content">
        <button id="toggle-theme-btn">
          <span class="light-mode-text">Light</span>/<span
            class="dark-mode-text"
            >Dark</span
          >
        </button>
      </div>
    </header>
    <div class="wrapper">
      <article>
        <h1 id="main-heading">Neotoc Playground ⚽</h1>
        <div id="dummy-content">
          ${content}
        </div>
      </article>
      <nav></nav>
    </div>
  </body>
</html>\n`;
}
