export function css(bgLight: string, bgDark: string) {
  return `:root * {
  box-sizing: border-box;
}

:root {
  --bg: ${bgLight};
  --fg: black;
  --bg-overlay: hsl(from var(--bg) h s 90%);
  --border: hsl(from var(--bg) h s 76%);
  scroll-behavior: smooth;
  font-family: system-ui, sans-serif;
}

:root.dark {
  --bg: ${bgDark};
  --fg: white;
  --bg-overlay: hsl(from var(--bg) h s 7%);
  --border: hsl(from var(--bg) h s 12%);
}

.disable-transitions * {
  transition: none !important;
}

body {
  margin: 0;
  background-color: var(--bg);
  color: var(--fg);
}

.wrapper {
  display: grid;
  grid-template-columns: 1fr minmax(0, 596px) 20px 320px 1fr;
}

article {
  padding-inline: 0.5rem;
  grid-column-start: 2;
}

nav {
  position: relative;
  grid-column-start: 4;
}

.nt-widget {
  --body-height: calc(100vh - 8rem);
  position: sticky;
  top: 4rem;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  overflow: hidden;
}

header {
  height: 3rem;
  background: var(--bg-overlay);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10000;
}

.header-content {
  max-width: 1280px;
  padding-inline: 1rem;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
}

#toggle-theme-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--fg);
  margin-left: auto;
}

.dark-mode-text,
.light-mode-text {
  padding: 2px;
  margin: 2px;
  width: 35px;
  display: inline-block;
}

.dark .dark-mode-text {
  text-decoration: underline;
}

.light .light-mode-text {
  text-decoration: underline;
}

@media (max-width: 767px) {
  .wrapper {
    grid-template-columns: 1fr;
  }

  article {
    grid-column-start: 1;
  }

  .nt-widget {
    --body-height: calc(50vh);
    border: none;
    border-radius: 0;
  }

  nav {
    position: fixed;
    width: 70vw;
    top: 3rem;
    right: 0;
    border: 1px solid var(--border);
    border-top: none;
    border-right: none;
    border-bottom-left-radius: 10px;
    overflow: hidden;
  }
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 2rem;
  margin-bottom: 0;
  scroll-margin-top: 4rem;
}

h1 {
  font-size: 2.5rem;
}
h2 {
  font-size: 2rem;
}
h3 {
  font-size: 1.5rem;
}
h4,
h5,
h6 {
  font-size: 1.1rem;
}\n`;
}
