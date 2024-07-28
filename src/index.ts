import {
  elt,
  fillElt,
  getViewportYSize,
  findScrollContainer,
  getDeepFoldableDivs,
  calculateYBasedOnFolding,
} from './utils.js';

type FoldStatus = 'none' | 'allFolded' | 'allUnfolded' | 'mixed';

type MirrorFunc = (tocHolder: HTMLElement) => (y1: number, y2: number) => void;

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

  const anchorToDeepFoldableDivsMap = new Map<
    HTMLAnchorElement,
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

  if (foldable) {
    toc
      .querySelectorAll<HTMLAnchorElement>('a')
      .forEach((a) =>
        anchorToDeepFoldableDivsMap.set(
          a,
          getDeepFoldableDivs(a, foldableDivClass),
        ),
      );
  }

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
              if (!intersectionRatioOfFirstSection) {
                intersectionRatioOfFirstSection = intersectionRatio;
              } else {
                intersectionRatioOfLastSection = intersectionRatio;
              }
              anchorsOfSectionsInView.push(idToAnchorMap[curH.id]);
              if (topOffsetRatio === null)
                topOffsetRatio = (viewportTop - sectionTop) / sectionHeight;
            }
          } else if (sectionTop < viewportBottom!) {
            const intersectionHeight =
              Math.min(sectionBottom, viewportBottom!) - sectionTop;
            const intersectionRatio = intersectionHeight / sectionHeight;
            if (!intersectionRatioOfFirstSection) {
              intersectionRatioOfFirstSection = intersectionRatio;
            } else {
              intersectionRatioOfLastSection = intersectionRatio;
            }
            anchorsOfSectionsInView.push(idToAnchorMap[curH.id]);
            if (topOffsetRatio === null) topOffsetRatio = 0; // This forced to 0 here cause otherwise it would cause meaningless offset
          }
        }
      }

      if (anchorsOfSectionsInView.length) {
        const a1 = anchorsOfSectionsInView[0];
        const rect1 = a1.getBoundingClientRect();

        const y1Max = rect1.top + rect1.height * topOffsetRatio!;
        let y2Max = y1Max + rect1.height * intersectionRatioOfFirstSection!;

        // It doesn't actually matter the what initial value you assign here
        // as they are assigned the right one in the conditions. But without assigning
        // any inital value causes a TypeScript error(2454) when they are accessed
        // outside the conditions where they are assigned some value, even under
        // proper logical conditions. So the following assignment for initial values are
        // just for ignoring that annoying TS error. These are however the best initial values
        // IMO. If you know a better fix, please do a pull request. Your contributions are
        // most welcome.
        let y1Min: number = y1Max;
        let y2Min: number = y2Max;

        if (foldable) {
          const deepFoldableDivsForA1 = anchorToDeepFoldableDivsMap.get(a1)!;
          y1Min = calculateYBasedOnFolding(deepFoldableDivsForA1, y1Max);
          y2Min = calculateYBasedOnFolding(deepFoldableDivsForA1, y2Max);
        }

        if (anchorsOfSectionsInView.length > 1) {
          const a2 =
            anchorsOfSectionsInView[anchorsOfSectionsInView.length - 1];
          const rect2 = a2.getBoundingClientRect();

          y2Max = rect2.top + rect2.height * intersectionRatioOfLastSection!;

          if (foldable) {
            y2Min = calculateYBasedOnFolding(
              anchorToDeepFoldableDivsMap.get(a2)!,
              y2Max,
            );
          }
        }

        const height = foldable ? y2Min - y1Min : y2Max - y1Max;
        const top =
          (foldable ? y1Min : y1Max) - tocHolder.getBoundingClientRect().top;
        reflect(top, height); // provide necessary args
      }
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
