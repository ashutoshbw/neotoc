import {
  elt,
  fillElt,
  getViewportYSize,
  findScrollContainer,
  getParentFoldableDiv,
  getDeepFoldableDivs,
} from './utils.js';

type FoldStatus = 'none' | 'allFolded' | 'allUnfolded' | 'mixed';

type MirrorFunc = (tocHolder: HTMLElement) => (a: HTMLAnchorElement[]) => void;

interface Options {
  contentHolder?: HTMLElement;
  marginTop?: number;
  marginBottom?: number;
  headings: HTMLHeadingElement[] | NodeListOf<HTMLHeadingElement>;
  tocHolder: HTMLElement;
  fillAnchor: (heading: HTMLHeadingElement, order: number[]) => string | Node;
  listType?: 'ul' | 'ol';
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
  initialFoldLevel?: number;
  handleFoldStatusChange: (foldStatus: FoldStatus) => void;
  setMirror?: MirrorFunc;
}

interface FoldState {
  isFolded: boolean;
  level: number;
  toggleFold: () => void;
  foldableDiv: HTMLDivElement;
  anchor: HTMLAnchorElement;
  isManuallyToggledFoldInAutoFold: boolean;
}

type FoldStates = FoldState[];

export default function tocMirror({
  // About contentHolder: By default it is first heading's parent element,
  // it's not possible to set the default value here so it's done with code
  contentHolder,
  marginTop = 0,
  marginBottom = 0,
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
  handleFoldStatusChange,
  setMirror,
}: Options) {
  const foldStates: FoldStates = [];

  let minHLevel: number = 0,
    maxHLevel: number = 0;

  // caches below:
  const idToAnchorMap: { [x: string]: HTMLAnchorElement } = {};
  const anchorToParentFoldableDivMap = new Map<
    HTMLAnchorElement,
    HTMLDivElement | null
  >();

  // Below is map from a foldableDiv to itself and its ancestor foldableDivs.
  const deepFoldableDivsMap = new Map<
    HTMLDivElement,
    // Note that the first element in the array value will be the same element as the key.
    // Reason: When we need this array we need that value too. And making that here will boost performance.
    HTMLDivElement[]
  >();

  function genToc(
    headings: HTMLHeadingElement[] | NodeListOf<HTMLHeadingElement>,
    order: number[] = [],
  ): HTMLUListElement | HTMLOListElement | undefined {
    if (!headings.length) return;

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
      idToAnchorMap[h.id] = anchor;

      const subHeadings = [];
      const curHeadingLevel = +h.tagName[1];

      if (minHLevel && maxHLevel) {
        if (curHeadingLevel < minHLevel) minHLevel = curHeadingLevel;
        if (curHeadingLevel > maxHLevel) maxHLevel = curHeadingLevel;
      } else {
        minHLevel = maxHLevel = curHeadingLevel;
      }

      for (let j = i + 1; j < headings.length; j++) {
        if (+headings[j].tagName[1] > curHeadingLevel) {
          subHeadings.push(headings[j]);
        } else {
          break;
        }
      }

      if (subHeadings.length > 0) {
        const nestedListContainer = genToc(subHeadings, order) as
          | HTMLUListElement
          | HTMLOListElement;

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
            checkForFoldStatusChange(handleFoldStatusChange);
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
  function normalizeFolds(foldType: boolean, refLevel: number) {
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
    checkForFoldStatusChange(handleFoldStatusChange);
  }

  let lastFoldStatus: FoldStatus;

  function checkForFoldStatusChange(cb: (foldStatus: FoldStatus) => void) {
    if (!foldStates.length) {
      lastFoldStatus == 'none';
      cb('none');
      return;
    }

    const firstFoldType = foldStates[0].isFolded;
    let isAllFoldsOfSameType = true;

    for (let i = 1; i < foldStates.length; i++) {
      if (foldStates[i].isFolded != firstFoldType) isAllFoldsOfSameType = false;
    }

    let curFoldStatus: FoldStatus;
    if (isAllFoldsOfSameType) {
      curFoldStatus = firstFoldType ? 'allFolded' : 'allUnfolded';
    } else {
      curFoldStatus = 'mixed';
    }

    if (curFoldStatus != lastFoldStatus) {
      lastFoldStatus = curFoldStatus;
      cb(curFoldStatus);
    }
  }

  function getFoldBoundaryInfo() {
    // 1 is lowest, 5 is highest
    let highestUnfoldedLevel: number | undefined;
    let lowestFoldedLevel: number | undefined;

    for (let i = 0; i < foldStates.length; i++) {
      const { isFolded, level } = foldStates[i];
      if (isFolded) {
        if (!lowestFoldedLevel) {
          lowestFoldedLevel = level;
        } else if (level < lowestFoldedLevel) {
          lowestFoldedLevel = level;
        }
      } else {
        if (!highestUnfoldedLevel) {
          highestUnfoldedLevel = level;
        } else if (level > highestUnfoldedLevel) {
          highestUnfoldedLevel = level;
        }
      }
    }

    return [lowestFoldedLevel, highestUnfoldedLevel];
  }

  const toc = genToc(headings);

  if (!toc) return;
  if (foldable) checkForFoldStatusChange(handleFoldStatusChange);

  interface MirrorProps {
    reflectOnce: () => void;
    startReflection: () => void;
    stopReflection: () => void;
  }

  const mirrorProps = <MirrorProps>{};

  tocHolder.append(toc);

  toc
    .querySelectorAll<HTMLAnchorElement>('a')
    .forEach((a) =>
      anchorToParentFoldableDivMap.set(
        a,
        getParentFoldableDiv(a, foldableDivClass),
      ),
    );

  toc
    .querySelectorAll<HTMLDivElement>(`.${foldableDivClass}`)
    .forEach((div) =>
      deepFoldableDivsMap.set(div, getDeepFoldableDivs(div, foldableDivClass)),
    );

  // Since there is toc, there is heading with more than 0 items.
  // So we can do this:
  if (!contentHolder) contentHolder = headings[0].parentElement!;

  if (setMirror) {
    const scrollContainer = findScrollContainer(contentHolder);

    const reflect = setMirror(tocHolder);

    mirrorProps.reflectOnce = () => {
      const [viewportTop, viewportBottom] = getViewportYSize(
        scrollContainer,
        marginTop,
        marginBottom,
      );

      const anchorsOfSectionsInView = [];
      let intersectionRatioOfFirstSection: null | number = null;
      let intersectionRatioOfLastSection: null | number = null;
      let topOffsetRatio: null | number = null;

      for (let i = 0; i < headings.length; i++) {
        const curH = headings[i];
        const nextH = headings[i + 1];

        const sectionTop = curH.getBoundingClientRect().top;
        const sectionBottom = nextH
          ? nextH.getBoundingClientRect().top
          : contentHolder.getBoundingClientRect().bottom;

        const sectionHeight = sectionBottom - sectionTop;

        if (viewportTop !== null) {
          if (sectionTop < viewportTop) {
            if (sectionBottom > viewportTop) {
              const intersectionHeight =
                Math.min(sectionBottom, viewportBottom!) - viewportTop;
              const intersectionRatio = intersectionHeight / sectionHeight;
              if (i == 0) {
                intersectionRatioOfFirstSection = intersectionRatio;
              } else if (i == headings.length - 1) {
                intersectionRatioOfLastSection = intersectionRatio;
              }
              anchorsOfSectionsInView.push(idToAnchorMap[curH.id]);
              topOffsetRatio = 1 - intersectionRatio;
            }
          } else if (sectionTop < viewportBottom!) {
            const intersectionHeight =
              Math.min(sectionBottom, viewportBottom!) - sectionTop;
            const intersectionRatio = intersectionHeight / sectionHeight;
            if (i == 0) {
              intersectionRatioOfFirstSection = intersectionRatio;
            } else if (i == headings.length - 1) {
              intersectionRatioOfLastSection = intersectionRatio;
            }
            anchorsOfSectionsInView.push(idToAnchorMap[curH.id]);
            topOffsetRatio = 0; // This forced to 0 here cause otherwise it would cause meaningless offset
          }
        }
      }

      reflect(anchorsOfSectionsInView); // provide necessary args
    };

    let rafNum: number;

    let previousTime: number;
    const step = (timestamp: number) => {
      if (previousTime !== timestamp) {
        mirrorProps.reflectOnce();
      }

      previousTime = timestamp;
      rafNum = window.requestAnimationFrame(step);
    };

    mirrorProps.startReflection = () => {
      rafNum = window.requestAnimationFrame(step);
    };

    mirrorProps.stopReflection = () => {
      console.log('rafNum', rafNum);
      window.cancelAnimationFrame(rafNum);
    };
  }

  const foldableProps = {
    foldAll() {
      normalizeFolds(true, 1);
    },
    unfoldAll() {
      normalizeFolds(false, 5);
    },
    fold() {
      const [lowestFoldedLevel, highestUnfoldedLevel] = getFoldBoundaryInfo();

      if (lowestFoldedLevel) {
        normalizeFolds(true, lowestFoldedLevel - 1);
      } else if (highestUnfoldedLevel) {
        normalizeFolds(true, highestUnfoldedLevel);
      }
    },
    unfold() {
      const [lowestFoldedLevel] = getFoldBoundaryInfo();

      if (lowestFoldedLevel) {
        normalizeFolds(true, lowestFoldedLevel + 1);
        normalizeFolds(false, lowestFoldedLevel);
      }
    },
  };

  const mandatoryProps = {
    element: toc,
    depth: maxHLevel - minHLevel + 1,
    ...mirrorProps,
    // setupMirror() {},
    // reflect() {},
    // refresh() {},
    // remove() {},
  };

  if (foldable) {
    return { ...mandatoryProps, ...foldableProps };
  } else {
    return mandatoryProps;
  }
}
