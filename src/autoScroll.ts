let isScrolling: boolean = false;
let wasTopEndAboveTopBoundary: null | boolean = null;
let wasBottomEndBelowBottomBoundary: null | boolean = null;
let timeFrac = 0;
let scrollNeeded = 0;
let startingSmoothScrollTop = 0;
let smoothScrollStartTime: number;
let lastAutoScrollTop: null | number = null; // For stoping auto scrolling the toc when it's manually scrolled

// Credit: https://easings.net/#easeOutCubic
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export type EasingFunc = (timeFrac: number) => number;

function getBoundaries(
  tocHolder: HTMLElement,
  offset: number,
): [number, number] {
  const curScrollTop = tocHolder.scrollTop;
  const tocHolderInnerHeight = tocHolder.clientHeight;
  const topBoundary = curScrollTop + offset;
  const bottomBoundary = curScrollTop + tocHolderInnerHeight - offset;

  return [topBoundary, bottomBoundary];
}

export function prepareForMicroScrolling(
  tocHolder: HTMLElement,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
) {
  const [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  const isTopEndAboveTopBoundary = outlineMarkerTop < topBoundary;
  const isBottomEndBelowBottomBoundary = outlineMarkerBottom > bottomBoundary;

  wasTopEndAboveTopBoundary = isTopEndAboveTopBoundary;
  wasBottomEndBelowBottomBoundary = isBottomEndBelowBottomBoundary;
}

export function animateMacroScrollingIfNeeded(
  tocHolder: HTMLElement,
  scrollBehavior: 'instant' | 'smooth',
  easingFunc: EasingFunc,
  duration: number,
  curTimestamp: number,
) {
  if (isScrolling) {
    const curScrollTop = tocHolder.scrollTop;
    if (scrollBehavior == 'instant') {
      tocHolder.scrollTop = curScrollTop + scrollNeeded;
      isScrolling = false;
    } else {
      timeFrac = (curTimestamp - smoothScrollStartTime) / duration;
      if (timeFrac > 1) timeFrac = 1;
      const scrollProgress = scrollNeeded * easingFunc(timeFrac);

      // The role lastAutoScrollTop here is to prevent auto scrolling the toc
      // when it's manually scrolled.
      if (lastAutoScrollTop === null || lastAutoScrollTop === curScrollTop) {
        tocHolder.scrollTop = startingSmoothScrollTop + scrollProgress;
        lastAutoScrollTop = tocHolder.scrollTop;
      } else {
        isScrolling = false;
        lastAutoScrollTop = null;
      }

      if (timeFrac == 1) {
        isScrolling = false;
      }
    }
  }
}

export function animateMicroScrollIfNeeded(
  tocHolder: HTMLElement,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
) {
  const curScrollTop = tocHolder.scrollTop;
  const [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  const isTopEndAboveTopBoundary = outlineMarkerTop < topBoundary;
  const isBottomEndBelowBottomBoundary = outlineMarkerBottom > bottomBoundary;

  if (wasTopEndAboveTopBoundary === null)
    wasTopEndAboveTopBoundary = isTopEndAboveTopBoundary;
  if (wasBottomEndBelowBottomBoundary === null)
    wasBottomEndBelowBottomBoundary = isBottomEndBelowBottomBoundary;

  if (isTopEndAboveTopBoundary && wasTopEndAboveTopBoundary === false) {
    // executed when outlineMarkerTop just went above top boundary
    tocHolder.scrollTop = curScrollTop - (topBoundary - outlineMarkerTop);
  }

  if (
    isBottomEndBelowBottomBoundary &&
    wasBottomEndBelowBottomBoundary === false
  ) {
    // executed when outlineMarkerBottom just went below bottom boundary
    tocHolder.scrollTop = curScrollTop + outlineMarkerBottom - bottomBoundary;
  }
}

export function initSmoothScrolling(
  yMaxDir: 'up' | 'down',
  tocHolder: HTMLElement,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
  curTimestamp: number,
) {
  const [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);

  isScrolling = !(
    (outlineMarkerTop === topBoundary && yMaxDir == 'up') ||
    (outlineMarkerBottom === bottomBoundary && yMaxDir == 'down')
  );

  // Update scrollNeeded global variable
  // Also update isScrolling to be more precise
  if (isScrolling) {
    scrollNeeded =
      yMaxDir == 'up'
        ? outlineMarkerTop - topBoundary
        : outlineMarkerBottom - bottomBoundary;

    const curScrollTop = tocHolder.scrollTop;
    const maxScrollTop = tocHolder.scrollHeight - tocHolder.clientHeight;
    const freeScrollTop = curScrollTop + scrollNeeded;

    if (freeScrollTop < 0) {
      scrollNeeded = -curScrollTop;
    } else if (freeScrollTop > maxScrollTop) {
      scrollNeeded = maxScrollTop - curScrollTop;
    }

    if (!scrollNeeded) isScrolling = false;
    timeFrac = 0;
    smoothScrollStartTime = curTimestamp;
    startingSmoothScrollTop = curScrollTop;
  }
}
