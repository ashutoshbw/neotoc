import tocMirror from './index.js';

const contentElement = document.querySelector('article');
const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
const tocHolder = document.getElementById('tocHolder');
const foldAllBtn = document.getElementById('fold-all');
const unfoldAllBtn = document.getElementById('unfold-all');
const foldBtn = document.getElementById('fold');
const unfoldBtn = document.getElementById('unfold');

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
  handleFoldStatusChange(foldStatus) {
    if (foldStatus == 'allFolded') {
      foldAllBtn.disabled = true;
      unfoldAllBtn.disabled = false;
      foldBtn.disabled = true;
      unfoldBtn.disabled = false;
    } else if (foldStatus == 'allUnfolded') {
      foldAllBtn.disabled = false;
      unfoldAllBtn.disabled = true;
      foldBtn.disabled = false;
      unfoldBtn.disabled = true;
    } else if (foldStatus == 'mixed') {
      foldAllBtn.disabled = false;
      unfoldAllBtn.disabled = false;
      foldBtn.disabled = false;
      unfoldBtn.disabled = false;
    } else {
    }
  },
});

foldAllBtn.addEventListener('click', toc.foldAll);
unfoldAllBtn.addEventListener('click', toc.unfoldAll);
foldBtn.addEventListener('click', toc.fold);
// unfoldBtn.addEventListener('click', toc.unfold);

// toc.setupMirror((toc) => {});

// toc.reflect(() => {});

// toc.refresh();

// toc.remove();
