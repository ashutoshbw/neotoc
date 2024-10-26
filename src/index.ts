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
import { addHighlight } from './highlight.js';
import { indentWidth, getRelativePadding } from './indents.js';

interface Options {
  selector: string;
  title?: string;
  fillAnchor?: (heading: HTMLHeadingElement) => string | Node;
  ellipsis?: boolean;
  classPrefix?: string;
  initialFoldLevel?: number;
  offsetTop?: number;
  offsetBottom?: number;
  autoFold?: boolean;
  autoScroll?: boolean;
  autoScrollOffset?: number;
  toggleFoldIcon?: string;
  unfoldableIcon?: string;
  foldIcon?: string;
  foldAllIcon?: string;
  unfoldIcon?: string;
  unfoldAllIcon?: string;
}

export default function neotoc({
  selector,
  title = 'On this page',
  fillAnchor = (h) => h.textContent!,
  ellipsis = false,
  classPrefix = 'nt-',
  initialFoldLevel = 6,
  offsetTop = 50,
  offsetBottom = 50,
  autoFold = false,
  autoScroll = true,
  autoScrollOffset = 50,
  // icon from https://icon-sets.iconify.design/akar-icons/triangle-down-fill/
  toggleFoldIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6 8a1 1 0 0 0-.8 1.6l6 8a1 1 0 0 0 1.6 0l6-8A1 1 0 0 0 18 8z"/></svg>',
  // https://icon-sets.iconify.design/radix-icons/dot-filled/
  unfoldableIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15"><path fill="currentColor" d="M9.875 7.5a2.375 2.375 0 1 1-4.75 0a2.375 2.375 0 0 1 4.75 0"/></svg>',
  // https://icon-sets.iconify.design/material-symbols/unfold-less-rounded/
  foldIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12 16.9l-2.4 2.4q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l3.1-3.1q.15-.15.325-.212t.375-.063t.375.063t.325.212l3.1 3.1q.275.275.275.7t-.275.7t-.7.275t-.7-.275zm0-9.8l2.4-2.4q.275-.275.7-.275t.7.275t.275.7t-.275.7l-3.1 3.1q-.15.15-.325.213T12 9.475t-.375-.062T11.3 9.2L8.2 6.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275z"/></svg>',
  // https://icon-sets.iconify.design/material-symbols/unfold-less-double-rounded/
  foldAllIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12.025 20.8L9.55 23.25q-.275.275-.687.288t-.713-.288q-.275-.275-.275-.7t.275-.7l3.175-3.175q.15-.15.325-.213t.375-.062t.375.063t.325.212L15.9 21.85q.275.275.275.688t-.275.712q-.3.3-.712.3t-.713-.3zm0-5L9.55 18.25q-.275.275-.687.288t-.713-.288q-.275-.275-.275-.7t.275-.7l3.175-3.175q.15-.15.325-.213t.375-.062t.375.063t.325.212L15.9 16.85q.275.275.275.688t-.275.712q-.3.3-.712.3t-.713-.3zm0-7.65l2.45-2.45q.3-.3.713-.3t.712.3t.3.7t-.3.7l-3.175 3.2q-.15.15-.325.213t-.375.062t-.375-.062t-.325-.213l-3.2-3.2q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3zm0-5L14.475.7q.3-.3.713-.3t.712.3t.3.7t-.3.7l-3.175 3.2q-.15.15-.325.213t-.375.062t-.375-.062t-.325-.213l-3.2-3.2q-.3-.3-.288-.712T8.15.675t.713-.3t.712.3z"/></svg>',
  // https://icon-sets.iconify.design/material-symbols/unfold-more-rounded/
  unfoldIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12 18.1l2.325-2.325q.3-.3.725-.3t.725.3t.3.725t-.3.725L12.7 20.3q-.15.15-.325.213t-.375.062t-.375-.062t-.325-.213l-3.075-3.075q-.3-.3-.3-.725t.3-.725t.725-.3t.725.3zM12 6L9.675 8.325q-.3.3-.725.3t-.725-.3t-.3-.725t.3-.725L11.3 3.8q.15-.15.325-.213T12 3.526t.375.063t.325.212l3.075 3.075q.3.3.3.725t-.3.725t-.725.3t-.725-.3z"/></svg>',
  // https://icon-sets.iconify.design/material-symbols/unfold-more-double-rounded/
  unfoldAllIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12.025 21.15l2.475-2.475q.3-.3.7-.288t.7.313q.275.3.287.7t-.287.7l-3.175 3.175q-.15.15-.325.213t-.375.062t-.375-.062t-.325-.213L8.15 20.1q-.275-.275-.288-.687t.288-.713q.275-.275.7-.275t.7.275zm0-5l2.475-2.475q.3-.3.7-.287t.7.312q.275.3.287.7t-.287.7l-3.175 3.175q-.15.15-.325.213t-.375.062t-.375-.062t-.325-.213L8.15 15.1q-.275-.275-.288-.687t.288-.713q.275-.275.7-.275t.7.275zm0-8.325L9.55 10.3q-.3.3-.712.288t-.713-.313t-.3-.712t.3-.713l3.2-3.175q.15-.15.325-.213t.375-.062t.375.062t.325.213l3.175 3.2q.3.3.3.7t-.3.7t-.713.3t-.712-.3zm0-5L9.55 5.3q-.3.3-.712.288t-.713-.313t-.3-.712t.3-.713l3.2-3.175q.15-.15.325-.212T12.025.4t.375.063t.325.212l3.175 3.2q.3.3.3.7t-.3.7t-.713.3t-.712-.3z"/></svg>',
}: Options) {
  function elt<T extends HTMLElement>(type: string, className?: string): T {
    const e = document.createElement(type) as T;
    if (className) e.className = classPrefix + className;
    return e;
  }

  function addClass(elt: HTMLElement, className: string) {
    elt.classList.add(classPrefix + className);
  }

  function removeClass(elt: HTMLElement, className: string) {
    elt.classList.remove(classPrefix + className);
  }

  function classContains(elt: HTMLElement, className: string) {
    return elt.classList.contains(classPrefix + className);
  }

  function toggleClass(elt: HTMLElement, className: string) {
    elt.classList.toggle(classPrefix + className);
  }

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

  const [selectorPart1, selectorPart2, selectorPart3] = selector
    .split('>>')
    .map((s) => s.trim());

  const headings = document.querySelectorAll<HTMLHeadingElement>(
    `${selectorPart1} :is(${selectorPart2 == 'h*' ? 'h1,h2,h3,h4,h5,h6' : selectorPart2})`,
  );
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
      anchor.tabIndex = -1;
      nonFoldable.tabIndex = 0;
      anchor.href = `#${h.id}`;
      anchor.append(fillAnchor(h));
      if (ellipsis) {
        addClass(anchor, 'ellipsis');
        anchor.title = h.textContent!.trim();
      }

      nonFoldable.append(anchor);
      li.append(nonFoldable);

      idToAnchorMap[h.id] = anchor;

      anchor.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      nonFoldable.addEventListener('click', () => {
        anchor.click();
      });

      nonFoldable.addEventListener('keydown', (e) => {
        if (e.target == nonFoldable && e.key == 'Enter') {
          anchor.click();
        }
      });

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
        const toggleFoldButton = elt<HTMLDivElement>('div', 'toggle-fold-btn');
        const foldableDiv = elt<HTMLDivElement>('div', 'foldable');
        const isFolded = curHeadingLevel >= initialFoldLevel;

        if (isFolded) addClass(foldableDiv, 'foldable-folded');

        toggleFoldButton.tabIndex = 0;
        toggleFoldButton.innerHTML = toggleFoldIcon;

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

            runOnFoldStatusChange();
          },
          foldableDiv, // might be useful in future
          anchor, // only useful in autoFold
          isManuallyToggledFoldInAutoFold: false, // only useful in autoFold
        };

        foldStates.push(curFoldState);

        const handleToggleFold = () => {
          if (autoFold) {
            curFoldState.isManuallyToggledFoldInAutoFold = true;
          }
          curFoldState.toggleFold();
        };

        toggleFoldButton.addEventListener('click', () => {
          handleToggleFold();
        });

        toggleFoldButton.addEventListener('keydown', (e) => {
          if (e.key == 'Enter') {
            handleToggleFold();
          }
        });
      } else {
        const unfoldableIconDiv = elt('div', 'unfoldable-icon');
        unfoldableIconDiv.innerHTML = unfoldableIcon;
        nonFoldable.prepend(unfoldableIconDiv);
      }

      const hDepth = curHeadingLevel - firstHeadingLevel;

      let gridTemplateIndentColumns = '';
      for (let power = 1; power <= hDepth; power++) {
        const indentBlock = elt<HTMLDivElement>('div', 'indent-block');
        nonFoldable.prepend(indentBlock);
        gridTemplateIndentColumns = `${indentWidth(power)} ${power == hDepth ? '' : getRelativePadding(power)} var(--indent-line-gap) ${gridTemplateIndentColumns}`;
      }

      nonFoldable.style.cssText = `--max-indent-width: ${indentWidth(hDepth)}; grid-template-columns: ${gridTemplateIndentColumns} var(--toggle-fold-btn-width) 1fr`;

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
    runOnFoldStatusChange();
  }

  let lastFoldStatus: FoldStatus;

  function runOnFoldStatusChange() {
    function cb(foldStatus: FoldStatus) {
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
      }
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

  if (!toc) return () => {};

  addClass(toc, 'root-ul');

  const appendTarget = document.querySelector(selectorPart3);
  if (!appendTarget) throw new Error('Nothing found to append Neotoc to!');

  const widget = elt('div', 'widget');
  const tocHolder = elt('div', 'toc-holder');
  const topBar = elt('div', 'top-bar');
  const titleH2 = elt('h2', 'title');
  const btnGroup = elt('div', 'btn-group');
  const topbarBtnClsName = 'top-bar-btn';
  const foldBtn = elt<HTMLButtonElement>('button', topbarBtnClsName);
  const foldAllBtn = elt<HTMLButtonElement>('button', topbarBtnClsName);
  const unfoldBtn = elt<HTMLButtonElement>('button', topbarBtnClsName);
  const unfoldAllBtn = elt<HTMLButtonElement>('button', topbarBtnClsName);
  const topGradient = elt<HTMLDivElement>('div', 'top-gradient');
  const bottomGradient = elt<HTMLDivElement>('div', 'bottom-gradient');
  tocHolder.tabIndex = 0;
  foldBtn.innerHTML = foldIcon;
  foldAllBtn.innerHTML = foldAllIcon;
  unfoldBtn.innerHTML = unfoldIcon;
  unfoldAllBtn.innerHTML = unfoldAllIcon;

  if (foldStates.length) {
    const depth = maxHLevel - minHLevel;
    if (depth > 1) {
      btnGroup.append(foldBtn, unfoldBtn, foldAllBtn, unfoldAllBtn);
    } else {
      btnGroup.append(foldBtn, unfoldBtn);
    }
    runOnFoldStatusChange();
  }

  titleH2.innerHTML = title;
  topBar.append(titleH2, btnGroup);
  tocHolder.append(toc, topGradient, bottomGradient);
  widget.append(topBar, tocHolder);
  appendTarget.append(widget);

  function updateTopBottomGradientPositions() {
    const scrollTop = tocHolder.scrollTop;
    const highestScrollTop = tocHolder.scrollHeight - tocHolder.clientHeight;

    topGradient.style.top = scrollTop + 'px';
    bottomGradient.style.bottom = -scrollTop + 'px';
    topGradient.style.opacity = scrollTop > 5 ? '1' : '0';
    bottomGradient.style.opacity = scrollTop + 5 < highestScrollTop ? '1' : '0';
  }

  updateTopBottomGradientPositions();

  toc.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
    const [divs, anchors] = getAncestors(a, 'foldable', classPrefix);
    anchorToAncestorFoldableDivsMap.set(a, divs);
    anchorToAncestorAnchorsMap.set(a, anchors);
  });

  // Since there is toc, there is heading with more than 0 items.
  // So we can do this:
  const contentHolder = document.querySelector<HTMLElement>(selectorPart1)!;

  /**** ANIMATION LOGIC START ****/
  let rafNum: number;

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

  const draw = addHighlight(
    tocHolder,
    elt,
    addClass,
    removeClass,
    classContains,
  );

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
      const y1Min = calculateYBasedOnFolding(ancestorFoldableDivsForA1, y1Max);
      let y2Min = calculateYBasedOnFolding(ancestorFoldableDivsForA1, y2Max);

      if (anchorsToSectionsInView.length > 1) {
        const a2 = anchorsToSectionsInView[anchorsToSectionsInView.length - 1];
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

      const top = Math.round(y1Min + scrolledY - tocHolderTop - borderTopWidth);
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
      updateTopBottomGradientPositions();

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
      updateTopBottomGradientPositions();

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
  /**** ANIMATION LOGIC END ****/

  foldBtn.addEventListener('click', () => {
    const [lowestFoldedLevel, highestUnfoldedLevel] = getFoldBoundaryInfo();

    if (lowestFoldedLevel) {
      normalizeFolds(true, lowestFoldedLevel - 1);
    } else if (highestUnfoldedLevel) {
      normalizeFolds(true, highestUnfoldedLevel);
    }
  });

  unfoldBtn.addEventListener('click', () => {
    const [lowestFoldedLevel] = getFoldBoundaryInfo();

    if (lowestFoldedLevel) {
      normalizeFolds(true, lowestFoldedLevel + 1);
      normalizeFolds(false, lowestFoldedLevel);
    }
  });

  foldAllBtn.addEventListener('click', () => normalizeFolds(true, 1));
  unfoldAllBtn.addEventListener('click', () => normalizeFolds(false, 5));

  return () => {
    widget.remove();
    window.cancelAnimationFrame(rafNum);
  };
}
