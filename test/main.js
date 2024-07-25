/*
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
      console.log(foldStatus);
    }
  },
  setMirror(tocHolder) {
    return () => {
      console.log('foo');
    };
  },
});

if (toc) {
  foldAllBtn.addEventListener('click', toc.foldAll);
  unfoldAllBtn.addEventListener('click', toc.unfoldAll);
  foldBtn.addEventListener('click', toc.fold);
  unfoldBtn.addEventListener('click', toc.unfold);
  //TODO:  based on toc.depth show the only relevant buttons

  // TODO: toc.stopReflection();
}

console.log(toc);
*/

const rootElt = document.getElementById('wrapper');
const rootEltWrapper = document.getElementById('wrapper-wrapper');

function getYLimits(elt) {
  if (elt === document.documentElement) return [0, elt.clientHeight];

  const y1 = elt.getBoundingClientRect().y + elt.clientTop;
  const y2 = y1 + elt.clientHeight;

  return [y1, y2];
}

function getCroppedY([eY1, eY2], [cY1, cY2]) {
  let y1 = null,
    y2 = null;

  // Note that if eY1 is null, eY2 must be null too.
  if (eY1 === null) return [eY1, eY2];

  if (eY1 <= cY1) {
    if (eY2 > cY1) {
      y1 = cY1;
    }
  } else if (eY1 < cY2) {
    y1 = eY1;
  }

  if (eY2 <= cY2) {
    if (eY2 > cY1) {
      y2 = eY2;
    }
  } else if (eY1 < cY2) {
    y2 = cY2;
  }

  return [y1, y2];
}

function getViewportInfo(elt) {
  let parentElt = elt.parentElement;
  let [y1, y2] = getCroppedY(getYLimits(elt), getYLimits(parentElt));

  while (parentElt !== document.documentElement) {
    parentElt = parentElt.parentElement;
    [y1, y2] = getCroppedY([y1, y2], getYLimits(parentElt));
  }

  return [y1, y2];
}
