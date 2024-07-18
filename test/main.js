import tocMirror from './index.js';

const contentElement = document.querySelector('article');
const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');

const toc = tocMirror({ headings: 90, scrollContainex: 19 });

// toc.setupMirror((toc) => {});

// toc.reflect(() => {});

// toc.refresh();

// toc.remove();
