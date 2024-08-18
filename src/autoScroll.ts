/*  # A Note on bicycle and motorcycle Scrolling
 *
 * These names might be kind of werid, but I haven't yet found anything better
 * than them to help me remember what they do! If you think you found better
 * names, you can let me know by opening an issue.
 *
 *
 * ## Bicycle Scrolling:
 *
 * It is somewhat similar to riding a bicyle. You need to put effort to make it
 * happen. It happens when scrolling the content, if the outline marker goes
 * from inside the boundaries(set by `autoScrollOffset`) to outside. The
 * `tocHolder` is then automatically scrolled so that the outline marker appears
 * right on a boundary. Two functions makes it happen together:
 * `prepareForBicycleScrolling` and `animateBicyleScrollingIfNeeded`
 *
 * ## Motorcycle Scrolling
 *
 * Like a motorcyle you just need to start and then it runs automatically!
 * It happens when scrolling the content, if there is any need to scroll the toc
 * in any situation. It then automatially scrolls the `tocHolder` so that the
 * outline marker is visible in a sensible way. The function that makes it
 * happen is: `animateMotorcycleScrollingIfNeeded`
 * */

let isScrolling: boolean = false;
let wasTopEndAboveTopBoundary: null | boolean = null;
let wasBottomEndBelowBottomBoundary: null | boolean = null;
let timeFrac = 0;
let scrollNeeded = 0;
let motorcycleScrollingStartScrollTop = 0;
let motorcycleScrollingStartTime: number;
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

export function prepareForBicycleScrolling(
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

export function animateMotorcycleScrollingIfNeeded(
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
      timeFrac = (curTimestamp - motorcycleScrollingStartTime) / duration;
      if (timeFrac > 1) timeFrac = 1;
      const scrollProgress = scrollNeeded * easingFunc(timeFrac);

      // The role lastAutoScrollTop here is to prevent auto scrolling the toc
      // when it's manually scrolled.
      if (lastAutoScrollTop === null || lastAutoScrollTop === curScrollTop) {
        tocHolder.scrollTop =
          motorcycleScrollingStartScrollTop + scrollProgress;
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

export function animateBicycleScrollingIfNeeded(
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

export function initMotorcycleScrolling(
  yMaxDir: 'up' | 'down',
  tocHolder: HTMLElement,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
  curTimestamp: number,
) {
  const [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);

  if (outlineMarkerTop > topBoundary && outlineMarkerBottom < bottomBoundary) {
    isScrolling = false;
  } else if (outlineMarkerTop === topBoundary) {
    if (yMaxDir == 'up') {
      isScrolling = false;
    } else if (outlineMarkerBottom > bottomBoundary) {
      isScrolling = true;
    } else {
      isScrolling = false;
    }
  } else if (outlineMarkerBottom === bottomBoundary) {
    if (yMaxDir == 'down') {
      isScrolling = false;
    } else if (outlineMarkerTop < topBoundary) {
      isScrolling = true;
    } else {
      isScrolling = false;
    }
  } else {
    isScrolling = true;
  }

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
    motorcycleScrollingStartTime = curTimestamp;
    motorcycleScrollingStartScrollTop = curScrollTop;
  }
}
