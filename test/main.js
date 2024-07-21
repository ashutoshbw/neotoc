import tocMirror from './index.js';

const contentElement = document.querySelector('article');
const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
const tocHolder = document.getElementById('tocHolder');
const foldAllBtn = document.getElementById('fold-all');
const unfoldAllBtn = document.getElementById('unfold-all');

const toc = tocMirror({
  headings: headings,
  tocHolder,
  foldable: true,
  initialFoldLevel: 3,
  fillFoldButton(isFolded) {
    if (isFolded) return '+';
    else return '-';
  },
  fillAnchor(h, order) {
    return order.join('.') + ' ' + h.textContent;
  },
  handleFoldStateChange(foldStatus) {
    console.log(foldStatus);
  },
});

foldAllBtn.addEventListener('click', toc.foldAll);
unfoldAllBtn.addEventListener('click', toc.unfoldAll);

// toc.setupMirror((toc) => {});

// toc.reflect(() => {});

// toc.refresh();

// toc.remove();
