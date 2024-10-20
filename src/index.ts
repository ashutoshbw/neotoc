import {
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
import {
  initMotorcycleScrolling,
  prepareForBicycleScrolling,
  animateMotorcycleScrollingIfNeeded,
  animateBicycleScrollingIfNeeded,
  type AutoScrollState,
} from './autoScroll.js';

export type HighlightedArea =
  | {
      top: number;
      bottom: number;
      height: number;
      isTopInAFold: boolean;
      isBottomInAFold: boolean;
      anchors: HTMLAnchorElement[];
      isVisible: true;
      time: number;
    }
  | {
      isVisible: false;
      time: number;
    };

export type Draw = (highlightedArea: HighlightedArea) => void;
export interface AnimationFrame {
  draw: Draw;
  cleanup: () => void;
}
export type AddAnimation = (props: {
  tocHolder: HTMLElement;
}) => AnimationFrame;

interface Options {
  offsetTop?: number;
  offsetBottom?: number;
  selector: string;
  tocHolder: HTMLElement;
  fillAnchor?: (heading: HTMLHeadingElement) => string | Node;
  autoFold?: boolean;
  autoScroll?: boolean;
  autoScrollOffset?: number;
  classPrefix?: string;
  toggleFoldButtonSVG: string;
  initialFoldLevel?: number;
  handleFoldStatusChange?: (foldStatus: FoldStatus) => void;
  addAnimation?: AddAnimation;
}

interface NeotocOutput {
  list: null | HTMLUListElement;
  depth: number;
  destroy: () => void;
  fold: () => void;
  unfold: () => void;
  foldAll: () => void;
  unfoldAll: () => void;
}

export default function neotoc({
  offsetTop = 0,
  offsetBottom = 0,
  selector,
  tocHolder,
  classPrefix = 'nt-',
  fillAnchor = (h) => h.textContent!,
  // icon from https://icon-sets.iconify.design/akar-icons/triangle-down-fill/
  toggleFoldButtonSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6 8a1 1 0 0 0-.8 1.6l6 8a1 1 0 0 0 1.6 0l6-8A1 1 0 0 0 18 8z"/></svg>',
  initialFoldLevel = 6,
  autoFold = false,
  autoScroll = false,
  autoScrollOffset = 50,
  handleFoldStatusChange,
  addAnimation,
}: Options): NeotocOutput {
  function elt<T extends HTMLElement>(type: string, className?: string): T {
    const e = document.createElement(type) as T;
    if (className) e.className = classPrefix + className;
    return e;
  }

  function addClass(elt: HTMLElement, className: string) {
    elt.classList.add(classPrefix + className);
  }

  function toggleClass(elt: HTMLElement, className: string) {
    elt.classList.toggle(classPrefix + className);
  }

  const output: NeotocOutput = {
    list: null,
    depth: 0,
    destroy() {},
    fold() {},
    unfold() {},
    foldAll() {},
    unfoldAll() {},
  };

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

  const headings = document.querySelectorAll<HTMLHeadingElement>(selector);
  const firstHeadingLevel = +headings[0].tagName[1];

  function genToc(
    headings: HTMLHeadingElement[] | NodeListOf<HTMLHeadingElement>,
  ): HTMLUListElement | undefined {
    if (!headings.length) return;

    const ul = elt<HTMLUListElement>('ul');

    for (let i = 0; i < headings.length; i++) {
      const h = headings[i];
      const li = elt<HTMLLIElement>('li');
      const anchor = elt<HTMLAnchorElement>('a');
      const nonFoldable = elt<HTMLSpanElement>('div', 'non-foldable'); // only used when there is fold button
      anchor.href = `#${h.id}`;
      anchor.append(fillAnchor(h));

      nonFoldable.append(anchor);
      li.append(nonFoldable);

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
        const nestedUl = genToc(subHeadings) as HTMLUListElement;
        const toggleFoldButton = elt<HTMLButtonElement>(
          'button',
          'toggle-fold-btn',
        );
        const foldableDiv = elt<HTMLDivElement>('div', 'foldable');
        const isFolded = curHeadingLevel >= initialFoldLevel;

        if (isFolded) addClass(foldableDiv, 'foldable-folded');

        toggleFoldButton.innerHTML = toggleFoldButtonSVG;

        const toggleFoldButtonFoldedClass = 'toggle-fold-btn-folded';
        if (isFolded) {
          addClass(toggleFoldButton, toggleFoldButtonFoldedClass);
        }

        nonFoldable.prepend(toggleFoldButton);

        foldableDiv.append(nestedUl);
        li.append(foldableDiv);

        const curFoldState: FoldState = {
          isFolded,
          level: curHeadingLevel,
          toggleFold() {
            curFoldState.isFolded = !curFoldState.isFolded;

            toggleClass(foldableDiv, 'foldable-folded');
            toggleClass(toggleFoldButton, toggleFoldButtonFoldedClass);

            runOnFoldStatusChange(handleFoldStatusChange);
          },
          foldableDiv, // might be useful in future
          anchor, // only useful in autoFold
          isManuallyToggledFoldInAutoFold: false, // only useful in autoFold
        };

        foldStates.push(curFoldState);

        toggleFoldButton.addEventListener('click', () => {
          if (autoFold) {
            curFoldState.isManuallyToggledFoldInAutoFold = true;
          }
          curFoldState.toggleFold();
        });
      }

      for (let k = firstHeadingLevel; k < curHeadingLevel; k++) {
        const indentBlock = elt<HTMLDivElement>('div', 'indent-block');
        nonFoldable.prepend(indentBlock);
      }

      ul.append(li);
      i = i + subHeadings.length;
    }
    return ul;
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
    runOnFoldStatusChange(handleFoldStatusChange);
  }

  let lastFoldStatus: FoldStatus;

  function runOnFoldStatusChange(cb?: (foldStatus: FoldStatus) => void) {
    if (cb) {
      if (!foldStates.length) {
        lastFoldStatus == 'none';
        cb('none');
        return;
      }

      const firstFoldType = foldStates[0].isFolded;
      let isAllFoldsOfSameType = true;

      for (let i = 1; i < foldStates.length; i++) {
        if (foldStates[i].isFolded != firstFoldType)
          isAllFoldsOfSameType = false;
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

  if (!toc) return output;
  runOnFoldStatusChange(handleFoldStatusChange);

  addClass(toc, 'root-ul');
  tocHolder.append(toc);

  toc.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
    const [divs, anchors] = getAncestors(a, 'foldable', classPrefix);
    anchorToAncestorFoldableDivsMap.set(a, divs);
    anchorToAncestorAnchorsMap.set(a, anchors);
  });

  // Since there is toc, there is heading with more than 0 items.
  // So we can do this:
  const contentHolder = document.querySelector<HTMLElement>(
    selector.split(' ')[0],
  )!;

  let rafNum: number;
  let animationCleanupFunc: undefined | (() => void);
  if (addAnimation) {
    const autoScrollState: AutoScrollState = {
      isScrolling: false, // it doesn't matter what boolean value you assgin here, the appropriate one is set by `initMotorcycleScrolling`
      wasTopEndAboveTopBoundary: null,
      wasBottomEndBelowBottomBoundary: null,
      timeFrac: 0,
      scrollNeeded: 0,
      motorcycleScrollingStartScrollTop: 0,
      motorcycleScrollingStartTime: 0, // it doesn't matter what boolean value you assgin here, the appropriate one is set by `initMotorcycleScrolling`
      lastAutoScrollTop: null,
    };

    const scrollContainer = findScrollContainer(contentHolder);

    const { draw, cleanup } = addAnimation({
      tocHolder,
    });

    animationCleanupFunc = cleanup;

    let lastViewportHeight: null | number = null;
    let lastScrollContainerScrollTop: null | number = null;
    let lastTopInUnfoldedState: null | number = null;
    let lastBottomInUnfoldedState: null | number = null;
    let viewportHeight: null | number = null;
    let scrollContainerScrollTop: null | number = null;
    let topInUnfoldedState: null | number = null;
    let bottomInUnfoldedState: null | number = null;

    const runConditionally = (cb: () => void) => {
      const condition1 =
        topInUnfoldedState !== lastTopInUnfoldedState ||
        bottomInUnfoldedState !== lastBottomInUnfoldedState;

      // This check is necessary because sometimes in especially firefox,
      // even if there is no scroll in the `scrollContainer`, only scroll in
      // the `tocHolder` causes update to `topInUnfoldedState` and/or it's
      // related variables.
      const condition2 =
        scrollContainerScrollTop !== lastScrollContainerScrollTop;

      const condition3 = viewportHeight !== lastViewportHeight;

      const finalCondition = (condition1 && condition2) || condition3;

      finalCondition && cb();
    };

    const renderFrame = (curTimestamp: number) => {
      const [viewportTop, viewportBottom] = getViewportYSize(
        scrollContainer,
        offsetTop,
        offsetBottom,
      );

      const anchorsToSectionsInView: HTMLAnchorElement[] = [];
      let intersectionRatioOfFirstSection: null | number = null;
      let intersectionRatioOfLastSection: null | number = null;
      let topOffsetRatio: null | number = null;

      const doAutoFoldIfAllowed = () => {
        if (autoFold) {
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
        const i1 = a1.parentElement!; // it's the nonFoldable
        const rect1 = i1.getBoundingClientRect();

        // Vertical coordinates of highlighted area when toc is fully unfolded
        const y1Max = rect1.top + rect1.height * topOffsetRatio!;
        let y2Max = y1Max + rect1.height * intersectionRatioOfFirstSection!;

        const ancestorFoldableDivsForA1 =
          anchorToAncestorFoldableDivsMap.get(a1)!;

        // Vertical coordinates of highlighted area when toc may be folded somehow
        const y1Min = calculateYBasedOnFolding(
          ancestorFoldableDivsForA1,
          y1Max,
        );
        let y2Min = calculateYBasedOnFolding(ancestorFoldableDivsForA1, y2Max);

        if (anchorsToSectionsInView.length > 1) {
          const a2 =
            anchorsToSectionsInView[anchorsToSectionsInView.length - 1];
          const i2 = a2.parentElement!; // it's the nonFoldable

          const rect2 = i2.getBoundingClientRect();

          y2Max = rect2.top + rect2.height * intersectionRatioOfLastSection!;

          y2Min = calculateYBasedOnFolding(
            anchorToAncestorFoldableDivsMap.get(a2)!,
            y2Max,
          );
        }

        const tocHolderTop = tocHolder.getBoundingClientRect().top;
        const scrolledY = tocHolder.scrollTop;
        const borderTopWidth = tocHolder.clientTop;

        viewportHeight =
          viewportTop === null ? null : viewportBottom! - viewportTop;

        const top = Math.round(
          y1Min + scrolledY - tocHolderTop - borderTopWidth,
        );
        const bottom = Math.round(
          y2Min + scrolledY - tocHolderTop - borderTopWidth,
        );

        scrollContainerScrollTop = scrollContainer.scrollTop;
        topInUnfoldedState = Math.round(
          y1Max + scrolledY - tocHolderTop - borderTopWidth,
        );
        bottomInUnfoldedState = Math.round(
          y2Max + scrolledY - tocHolderTop - borderTopWidth,
        );

        // See it's definition to be clear about its purpose
        runConditionally(() => {
          const scrollDiff =
            scrollContainerScrollTop! -
            (lastScrollContainerScrollTop || scrollContainerScrollTop!);
          const scrollDir =
            scrollDiff > 0 ? 'down' : scrollDiff < 0 ? 'up' : 'down';

          doAutoFoldIfAllowed();
          if (autoScroll) {
            animateBicycleScrollingIfNeeded(
              tocHolder,
              top,
              bottom,
              autoScrollOffset,
              autoScrollState,
            );
            initMotorcycleScrolling(
              scrollDir,
              tocHolder,
              top,
              bottom,
              autoScrollOffset,
              curTimestamp,
              autoScrollState,
            );
          }
        });

        if (autoScroll) {
          prepareForBicycleScrolling(
            tocHolder,
            top,
            bottom,
            autoScrollOffset,
            autoScrollState,
          );

          animateMotorcycleScrollingIfNeeded(
            tocHolder,
            curTimestamp,
            autoScrollState,
          );
        }

        draw({
          height: Math.round(y2Min - y1Min),
          top: top,
          bottom: bottom,
          // Rounding is necssary because where they should be the same,
          // there may be a very slight difference.
          isTopInAFold: Math.round(y1Min!) < Math.round(y1Max),
          isBottomInAFold: Math.round(y2Min!) < Math.round(y2Max),
          anchors: anchorsToSectionsInView,
          time: curTimestamp,
          isVisible: true,
        });

        lastViewportHeight = viewportHeight;
        lastScrollContainerScrollTop = scrollContainerScrollTop;
        lastTopInUnfoldedState = topInUnfoldedState;
        lastBottomInUnfoldedState = bottomInUnfoldedState;
      } else {
        viewportHeight =
          scrollContainerScrollTop =
          topInUnfoldedState =
          bottomInUnfoldedState =
            null;

        runConditionally(() => {
          doAutoFoldIfAllowed();
        });
        draw({ isVisible: false, time: curTimestamp });

        lastViewportHeight =
          lastScrollContainerScrollTop =
          lastTopInUnfoldedState =
          lastBottomInUnfoldedState =
            null;
      }
    };

    let previousTime: number;
    const step = (timestamp: number) => {
      if (previousTime !== timestamp) {
        renderFrame(timestamp);
      }

      previousTime = timestamp;
      rafNum = window.requestAnimationFrame(step);
    };

    rafNum = window.requestAnimationFrame(step);
  }

  output.list = toc;
  output.depth = maxHLevel - minHLevel + 1;

  output.fold = () => {
    const [lowestFoldedLevel, highestUnfoldedLevel] = getFoldBoundaryInfo();

    if (lowestFoldedLevel) {
      normalizeFolds(true, lowestFoldedLevel - 1);
    } else if (highestUnfoldedLevel) {
      normalizeFolds(true, highestUnfoldedLevel);
    }
  };
  output.unfold = () => {
    const [lowestFoldedLevel] = getFoldBoundaryInfo();

    if (lowestFoldedLevel) {
      normalizeFolds(true, lowestFoldedLevel + 1);
      normalizeFolds(false, lowestFoldedLevel);
    }
  };

  output.foldAll = () => normalizeFolds(true, 1);
  output.unfoldAll = () => normalizeFolds(false, 5);
  output.destroy = () => {
    toc.remove();
    window.cancelAnimationFrame(rafNum);
    animationCleanupFunc?.();
  };

  return output;
}
