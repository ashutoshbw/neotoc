import {
  elt,
  fillElt,
  getViewportYSize,
  findScrollContainer,
  getAncestors,
  calculateYBasedOnFolding,
} from './utils.js';

import {
  type FoldState,
  type FoldStates,
  type FoldStatus,
} from './fold-types.js';
import { doAutoFold } from './autoFold.js';

type OutlineMarkerProps =
  | {
      top: number;
      bottom: number;
      height: number;
      isTopInAFold: boolean;
      isBottomInAFold: boolean;
      anchors: HTMLAnchorElement[];
      isInside: true;
    }
  | {
      isInside: false;
    };

type MirrorFunc = (props: {
  tocHolder: HTMLElement;
  foldButtonPos: 'start' | 'end';
}) => (outlineMakerProps: OutlineMarkerProps) => void;

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
  spanClass?: string;
  foldable?: boolean;
  foldButtonClass?: string;
  foldButtonFoldedClass?: string;
  foldButtonPos?: 'start' | 'end';
  useAndFillFoldButton?: (isFolded: boolean) => string | Node;
  foldableDivClass?: string;
  foldableDivFoldedClass?: string;
  initialFoldLevel?: number;
  handleFoldStatusChange: (foldStatus: FoldStatus) => void;
  setMirror?: MirrorFunc;
}

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
  spanClass = 'tm-span',
  fillAnchor,
  listType = 'ul',
  foldable = false,
  foldButtonPos = 'start',
  foldButtonClass = 'tm-fold-btn',
  foldButtonFoldedClass,
  foldableDivClass = 'tm-foldable-div',
  foldableDivFoldedClass = 'tm-foldable-div-folded',
  useAndFillFoldButton,
  initialFoldLevel = 6,
  autoFold = false,
  handleFoldStatusChange,
  setMirror,
}: Options) {
  if (autoFold) initialFoldLevel = 1;

  const foldStates: FoldStates = [];

  let minHLevel: number = 0,
    maxHLevel: number = 0;

  // caches below:
  const idToAnchorMap: { [x: string]: HTMLAnchorElement } = {};

  const anchorToAncestorFoldableDivsMap = new Map<
    HTMLAnchorElement,
    HTMLDivElement[]
  >();
  const anchorToAncestorAnchorsMap = new Map<
    HTMLAnchorElement,
    HTMLAnchorElement[]
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
      const anchorSpan = elt<HTMLSpanElement>('span', spanClass); // only used when there is fold button
      anchor.href = `#${h.id}`;
      fillElt(anchor, fillAnchor(h, order));

      if (useAndFillFoldButton) anchorSpan.append(anchor);
      li.append(useAndFillFoldButton ? anchorSpan : anchor);

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

          if (isFolded) foldableDiv.classList.add(foldableDivFoldedClass);

          if (useAndFillFoldButton) {
            fillElt(foldButton, useAndFillFoldButton(isFolded));

            if (isFolded && foldButtonFoldedClass) {
              foldButton.classList.add(foldButtonFoldedClass);
            }

            foldButtonPos == 'start'
              ? anchorSpan.prepend(foldButton)
              : anchorSpan.append(foldButton);
          }

          foldableDiv.append(nestedListContainer);
          li.append(foldableDiv);

          const curFoldState: FoldState = {
            isFolded,
            level: curHeadingLevel,
            toggleFold() {
              curFoldState.isFolded = !curFoldState.isFolded;

              foldableDiv.classList.toggle(foldableDivFoldedClass);
              if (useAndFillFoldButton) {
                if (foldButtonFoldedClass) {
                  foldButton.classList.toggle(foldButtonFoldedClass);
                } else {
                  fillElt(
                    foldButton,
                    useAndFillFoldButton(curFoldState.isFolded),
                  );
                }
              }
              checkForFoldStatusChange(handleFoldStatusChange);
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

  // `normalizeFolds` is intended to be called by the end user through events.
  // Here foldType true means "fold", false means "unfold"
  // Normalizing folds with foldType true means:
  //   fold all levels from refLevel and higher.
  // Normalizing folds with foldType false means:
  //   unfold all at the same fold level as refLevel or below it.
  function normalizeFolds(foldType: boolean, refLevel: number) {
    for (let i = 0; i < foldStates.length; i++) {
      const { isFolded, level, toggleFold } = foldStates[i];

      if (foldType) {
        if (!isFolded && level >= refLevel) {
          toggleFold();
          if (autoFold) foldStates[i].isManuallyToggledFoldInAutoFold = true;
        }
      } else {
        if (isFolded && level <= refLevel) {
          toggleFold();
          if (autoFold) foldStates[i].isManuallyToggledFoldInAutoFold = true;
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
    toc.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
      const [divs, anchors] = getAncestors(
        a,
        foldableDivClass,
        !!useAndFillFoldButton, // make it a boolean equivalent
        foldButtonPos,
      );
      anchorToAncestorFoldableDivsMap.set(a, divs);
      anchorToAncestorAnchorsMap.set(a, anchors);
    });
  }

  // Since there is toc, there is heading with more than 0 items.
  // So we can do this:
  if (!contentHolder) contentHolder = headings[0].parentElement!;

  if (setMirror) {
    const scrollContainer = findScrollContainer(contentHolder);

    const reflect = setMirror({ tocHolder, foldButtonPos });

    let lastTop: null | number = null;
    let lastBottom: null | number = null;
    let top: null | number;
    let bottom: null | number;

    const callIfTopOrBottomChanges = (cb: () => void) => {
      if (top !== lastTop || bottom !== lastBottom) cb();
    };

    mirrorProps.reflectOnce = () => {
      const [viewportTop, viewportBottom] = getViewportYSize(
        scrollContainer,
        marginTop,
        marginBottom,
      );

      const anchorsToSectionsInView: HTMLAnchorElement[] = [];
      let intersectionRatioOfFirstSection: null | number = null;
      let intersectionRatioOfLastSection: null | number = null;
      let topOffsetRatio: null | number = null;

      const doAutoFoldIfAllowed = () => {
        if (foldable && autoFold) {
          doAutoFold(
            foldStates,
            anchorsToSectionsInView,
            anchorToAncestorAnchorsMap,
          );
        }
      };

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
              anchorsToSectionsInView.push(idToAnchorMap[curH.id]);
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
            anchorsToSectionsInView.push(idToAnchorMap[curH.id]);
            if (topOffsetRatio === null) topOffsetRatio = 0; // This forced to 0 here cause otherwise it would cause meaningless offset
          }
        }
      }

      if (anchorsToSectionsInView.length) {
        const a1 = anchorsToSectionsInView[0];
        const i1 = useAndFillFoldButton ? a1.parentElement! : a1; // i1 is either the wrapping span(when fold button used) or the anchor
        const rect1 = i1.getBoundingClientRect();

        const y1Max = rect1.top + rect1.height * topOffsetRatio!;
        let y2Max = y1Max + rect1.height * intersectionRatioOfFirstSection!;

        // The following initial assignment is safe.
        // There is only one reason for this:
        // - It helps to not use any ts comment to ignore error 2454 which would
        //   cause if you didn't have any inital value here. It doesn't really
        //   matter what values you assign here.
        let y1Min: number = 0;
        let y2Min: number = 0;

        if (foldable) {
          const ancestorFoldableDivsForA1 =
            anchorToAncestorFoldableDivsMap.get(a1)!;
          y1Min = calculateYBasedOnFolding(ancestorFoldableDivsForA1, y1Max);
          y2Min = calculateYBasedOnFolding(ancestorFoldableDivsForA1, y2Max);
        }

        if (anchorsToSectionsInView.length > 1) {
          const a2 =
            anchorsToSectionsInView[anchorsToSectionsInView.length - 1];
          const i2 = useAndFillFoldButton ? a2.parentElement! : a2;

          const rect2 = i2.getBoundingClientRect();

          y2Max = rect2.top + rect2.height * intersectionRatioOfLastSection!;

          if (foldable) {
            y2Min = calculateYBasedOnFolding(
              anchorToAncestorFoldableDivsMap.get(a2)!,
              y2Max,
            );
          }
        }

        const tocHolderTop = tocHolder.getBoundingClientRect().top;

        top = (foldable ? y1Min : y1Max) - tocHolderTop;
        bottom = (foldable ? y2Min : y2Max) - tocHolderTop;

        callIfTopOrBottomChanges(() => {
          reflect({
            height: foldable ? y2Min - y1Min : y2Max - y1Max,
            top: top as number,
            bottom: bottom as number,
            // Rounding is necssary because where they should be the same,
            // there may be a very slight difference.
            isTopInAFold: foldable
              ? Math.round(y1Min) < Math.round(y1Max)
              : false,
            isBottomInAFold: foldable
              ? Math.round(y2Min) < Math.round(y2Max)
              : false,
            anchors: anchorsToSectionsInView,
            isInside: true,
          });
          doAutoFoldIfAllowed();
        });

        lastTop = top;
        lastBottom = bottom;
      } else {
        top = null;
        bottom = null;
        callIfTopOrBottomChanges(() => {
          reflect({ isInside: false });
          doAutoFoldIfAllowed();
        });
        lastTop = null;
        lastBottom = null;
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
