import { elt, fillElt } from './utils.js';

type FoldLevels = 1 | 2 | 3 | 4 | 5 | 6;

interface Options {
  content: HTMLElement;
  headings: HTMLHeadingElement[] | NodeListOf<HTMLHeadingElement>;
  tocHolder?: HTMLElement;
  fillAnchor: (heading: HTMLHeadingElement, order: number[]) => string | Node;
  listType?: 'ul' | 'ol';
  root?: HTMLElement;
  rootMarginTop?: number;
  rootMarginBottom?: number;
  autoFold?: boolean;
  liContainerClass?: string;
  liClass?: string;
  anchorClass?: string;
  foldable?: boolean;
  foldButtonClass?: string;
  foldButtonFoldedClass?: string;
  foldButtonPos?: 'start' | 'end';
  fillFoldButton: (isFolded: boolean) => string | Node;
  foldableDivClass?: string;
  foldableDivFoldedClass?: string;
  initialFoldLevel?: FoldLevels;
}

interface FoldState {
  isFolded: boolean;
  level: FoldLevels;
  toggleFold: () => void;
  foldableDiv: HTMLDivElement;
  anchor: HTMLAnchorElement;
  isManuallyToggledFoldInAutoFold: boolean;
}

type FoldStates = FoldState[];

export default function tocMirror({
  headings,
  tocHolder,
  liContainerClass = 'tm-li-container',
  liClass,
  anchorClass = 'tm-anchor',
  fillAnchor,
  listType = 'ul',
  foldable = false,
  foldButtonPos = 'start',
  foldButtonClass = 'tm-fold-btn',
  foldButtonFoldedClass,
  foldableDivClass = 'tm-foldable-div',
  foldableDivFoldedClass = 'tm-foldable-div-folded',
  fillFoldButton,
  initialFoldLevel = 1,
  autoFold = false,
}: Options) {
  const foldStates: FoldStates = [];

  function genToc(
    headings: HTMLHeadingElement[] | NodeListOf<HTMLHeadingElement>,
    order: number[] = [],
  ) {
    order.push(1);
    const listContainer = elt<HTMLUListElement | HTMLOListElement>(
      listType,
      liContainerClass,
    );

    for (let i = 0; i < headings.length; i++) {
      const h = headings[i];
      const li = elt<HTMLLIElement>('li', liClass);
      const anchor = elt<HTMLAnchorElement>('a', anchorClass);
      anchor.href = `#${h.id}`;
      fillElt(anchor, fillAnchor(h, order));

      li.append(anchor);

      const subHeadings = [];
      const curHeadingLevel = +h.tagName[1] as FoldLevels;
      for (let j = i + 1; j < headings.length; j++) {
        if (+headings[j].tagName[1] > curHeadingLevel) {
          subHeadings.push(headings[j]);
        } else {
          break;
        }
      }

      if (subHeadings.length > 0) {
        const nestedListContainer = genToc(subHeadings, order);

        if (foldable) {
          const foldButton = elt<HTMLButtonElement>('button', foldButtonClass);
          const foldableDiv = elt<HTMLDivElement>('div', foldableDivClass);
          const isFolded = curHeadingLevel >= initialFoldLevel;
          fillElt(foldButton, fillFoldButton(isFolded));

          if (isFolded) {
            foldableDiv.classList.add(foldableDivFoldedClass);
            if (foldButtonFoldedClass) {
              foldButton.classList.add(foldableDivFoldedClass);
            }
          }

          foldButtonPos == 'start'
            ? li.prepend(foldButton)
            : li.append(foldButton);
          foldableDiv.append(nestedListContainer);
          li.append(foldableDiv);

          const curFoldState: FoldState = {
            isFolded,
            level: curHeadingLevel,
            toggleFold() {
              curFoldState.isFolded = !curFoldState.isFolded;

              foldableDiv.classList.toggle(foldableDivFoldedClass);
              if (foldButtonFoldedClass) {
                foldButton.classList.toggle(foldButtonFoldedClass);
              } else {
                fillElt(foldButton, fillFoldButton(curFoldState.isFolded));
              }
              dispatch();
            },
            foldableDiv, // might be useful in future
            anchor, // only useful in autoFold
            isManuallyToggledFoldInAutoFold: false, // only useful in autoFold
          };

          foldStates.push(curFoldState);

          foldButton.addEventListener('click', () => {
            if (autoFold) {
              curFoldState.isManuallyToggledFoldInAutoFold = true;
            }
            curFoldState.toggleFold();
          });
        } else {
          li.append(nestedListContainer);
        }
      }
      listContainer.append(li);
      order[order.length - 1]++;
      i = i + subHeadings.length;
    }
    order.pop();
    return listContainer;
  }

  // Here foldType true means "fold", false means "unfold"
  // Normalizing folds with foldType true means:
  //   fold all levels from refLevel and higher.
  // Normalizing folds with foldType false means:
  //   unfold all at the same fold level as refLevel or below it.
  function normalizeFolds(foldType: boolean, refLevel: FoldLevels) {
    for (let i = 0; i < foldStates.length; i++) {
      const { isFolded, level, isManuallyToggledFoldInAutoFold, toggleFold } =
        foldStates[i];

      if (foldType) {
        if (!isFolded && level >= refLevel) {
          toggleFold();
        }
      } else {
        if (isFolded && level <= refLevel) {
          toggleFold();
        }
      }
    }
  }

  const toc = genToc(headings);

  function dispatch() {
    if (!foldStates.length) return;

    const initialFoldType = foldStates[0].isFolded;
    let isAllFoldsOfSameType = true;

    for (let i = 1; i < foldStates.length; i++) {
      if (foldStates[i].isFolded != initialFoldType)
        isAllFoldsOfSameType = false;
    }

    if (isAllFoldsOfSameType) {
      const event = new CustomEvent(
        initialFoldType ? 'allFolded' : 'allUnfolded',
      );
      toc.dispatchEvent(event);
    }
  }

  // Makeing it async. Because otherwise when you listen for the custom events
  // they will be already dispatched, and you will not be able to
  // react on it.
  setTimeout(() => dispatch(), 0);

  tocHolder?.append(toc);

  return {
    element: toc,
    foldAll() {
      normalizeFolds(true, 1);
    },
    unfoldAll() {
      normalizeFolds(false, 5);
    },
    // setupMirror() {},
    // reflect() {},
    // refresh() {},
    // remove() {},
  };
}
