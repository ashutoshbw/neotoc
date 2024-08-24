import neotoc from './index.js';

const contentElement = document.querySelector('article');
const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
const tocHolder = document.getElementById('tocHolder');
const foldAllBtn = document.getElementById('fold-all');
const unfoldAllBtn = document.getElementById('unfold-all');
const foldBtn = document.getElementById('fold');
const unfoldBtn = document.getElementById('unfold');

const toc = neotoc({
  headings: headings,
  offsetTop: 50,
  offsetBottom: 50,
  tocHolder,
  foldable: true,
  foldButtonPos: 'start',
  autoFold: false,
  autoScroll: true,
  autoScrollOffset: 150,
  autoScrollDuration: 300,
  autoScrollBehavior: 'smooth',
  initialFoldLevel: 6,
  useAndFillFoldButton(isFolded) {
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
  addAnimation({ tocHolder, foldButtonPos }) {
    let outlineMarker = document.createElement('div');
    let outlineMarkerTop = document.createElement('div');
    let outlineMarkerBottom = document.createElement('div');
    outlineMarker.className = 'outline-marker';
    outlineMarkerTop.className = 'outline-marker-top';
    outlineMarkerBottom.className = 'outline-marker-bottom';

    outlineMarker.append(outlineMarkerTop, outlineMarkerBottom);
    outlineMarker.style.display = 'none';

    tocHolder.append(outlineMarker);

    function draw(props) {
      if (props.isInside) {
        const { top, height, isTopInAFold, isBottomInAFold, anchors, time } =
          props;
        outlineMarker.style.display = '';
        outlineMarker.style.top = `${top}px`;
        outlineMarker.style.height = `${height}px`;

        outlineMarkerTop.style.backgroundColor = isTopInAFold ? 'beige' : '';
        outlineMarkerBottom.style.backgroundColor = isBottomInAFold
          ? 'beige'
          : '';

        outlineMarkerTop.style.zIndex = isTopInAFold ? '1' : '';
        outlineMarkerBottom.style.zIndex = isBottomInAFold ? '1' : '';
      } else {
        outlineMarker.style.display = 'none';
      }
      // console.log(props.isInside);
    }

    return { draw };
  },
});

if (toc) {
  foldAllBtn.addEventListener('click', toc.foldAll);
  unfoldAllBtn.addEventListener('click', toc.unfoldAll);
  foldBtn.addEventListener('click', toc.fold);
  unfoldBtn.addEventListener('click', toc.unfold);
  //TODO:  based on toc.depth show the only relevant buttons

  // toc.startAnimation();
}

console.log(toc);
