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

export interface AutoScrollState {
  isScrolling: boolean;
  wasTopEndAboveTopBoundary: null | boolean;
  wasBottomEndBelowBottomBoundary: null | boolean;
  timeFrac: number;
  scrollNeeded: number;
  motorcycleScrollingStartScrollTop: number;
  motorcycleScrollingStartTime: number;
  lastAutoScrollTop: null | number;
}

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
  state: AutoScrollState,
) {
  const [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  const isTopEndAboveTopBoundary = outlineMarkerTop < topBoundary;
  const isBottomEndBelowBottomBoundary = outlineMarkerBottom > bottomBoundary;

  state.wasTopEndAboveTopBoundary = isTopEndAboveTopBoundary;
  state.wasBottomEndBelowBottomBoundary = isBottomEndBelowBottomBoundary;
}

// This is for getting rid of inconsistency in different browsers
// when setting scrollTop in a zoomed in or out view. In chrome, in
// a zoomed in/out view, if you assign a particular scrollTop, it's not
// sure that exactly that is the resulted scrollTop. Chrome will assign a
// value close to it. This function ensures that when `incBool` is true,
// `tocHolder` will always scroll equal to `expected` or a little higher(never lower)
// ane when `incBool` is false, `tocHolder` will scroll equal to or a little
// lower `expected`(never higher).
function scrollApproximately(
  tocHolder: HTMLElement,
  expectedScrollTop: number,
  incBool: boolean,
) {
  const max = incBool ? 30 : -30;
  const diff = incBool ? 0.5 : -0.5;
  for (let i = 0; incBool ? i < max : i > max; i += diff) {
    tocHolder.scrollTop = expectedScrollTop + i;
    if (
      incBool
        ? tocHolder.scrollTop >= expectedScrollTop
        : tocHolder.scrollTop <= expectedScrollTop
    )
      break;
  }
}

export function animateMotorcycleScrollingIfNeeded(
  tocHolder: HTMLElement,
  scrollBehavior: 'instant' | 'smooth',
  easingFunc: EasingFunc,
  duration: number,
  curTimestamp: number,
  state: AutoScrollState,
) {
  if (state.isScrolling) {
    const curScrollTop = tocHolder.scrollTop;
    if (scrollBehavior == 'instant') {
      tocHolder.scrollTop = curScrollTop + state.scrollNeeded;
      state.isScrolling = false;
    } else {
      state.timeFrac = duration
        ? (curTimestamp - state.motorcycleScrollingStartTime) / duration
        : 1;
      if (state.timeFrac > 1) state.timeFrac = 1;
      const scrollProgress = state.scrollNeeded * easingFunc(state.timeFrac);

      // The role of lastAutoScrollTop here is to prevent auto scrolling the toc
      // when it's manually scrolled.
      if (
        state.lastAutoScrollTop === null ||
        state.lastAutoScrollTop === curScrollTop
      ) {
        tocHolder.scrollTop =
          state.motorcycleScrollingStartScrollTop + scrollProgress;
        state.lastAutoScrollTop = tocHolder.scrollTop;
      } else {
        state.isScrolling = false;
        state.lastAutoScrollTop = null;
      }

      if (state.timeFrac == 1) {
        const expected =
          state.motorcycleScrollingStartScrollTop + state.scrollNeeded;
        let incBool = true;
        if (state.scrollNeeded > 0) {
          incBool = true;
        } else if (state.scrollNeeded < 0) {
          incBool = false;
        }
        scrollApproximately(tocHolder, expected, incBool);
        state.isScrolling = false;
      }
    }
  }
}

export function animateBicycleScrollingIfNeeded(
  tocHolder: HTMLElement,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
  state: AutoScrollState,
) {
  const curScrollTop = tocHolder.scrollTop;
  const [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  const isTopEndAboveTopBoundary = outlineMarkerTop < topBoundary;
  const isBottomEndBelowBottomBoundary = outlineMarkerBottom > bottomBoundary;

  if (state.wasTopEndAboveTopBoundary === null)
    state.wasTopEndAboveTopBoundary = isTopEndAboveTopBoundary;
  if (state.wasBottomEndBelowBottomBoundary === null)
    state.wasBottomEndBelowBottomBoundary = isBottomEndBelowBottomBoundary;

  if (isTopEndAboveTopBoundary && state.wasTopEndAboveTopBoundary === false) {
    // executed when outlineMarkerTop just went above top boundary
    const expected = curScrollTop - (topBoundary - outlineMarkerTop);
    scrollApproximately(tocHolder, expected, false);
  }

  if (
    isBottomEndBelowBottomBoundary &&
    state.wasBottomEndBelowBottomBoundary === false
  ) {
    // executed when outlineMarkerBottom just went below bottom boundary
    const expected = curScrollTop + outlineMarkerBottom - bottomBoundary;
    scrollApproximately(tocHolder, expected, true);
  }
}

export function initMotorcycleScrolling(
  yMaxDir: 'up' | 'down',
  tocHolder: HTMLElement,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
  curTimestamp: number,
  state: AutoScrollState,
) {
  const [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);

  if (outlineMarkerTop > topBoundary && outlineMarkerBottom < bottomBoundary) {
    state.isScrolling = false;
  } else if (outlineMarkerTop === topBoundary) {
    if (yMaxDir == 'up') {
      state.isScrolling = false;
    } else if (outlineMarkerBottom > bottomBoundary) {
      state.isScrolling = true;
    } else {
      state.isScrolling = false;
    }
  } else if (outlineMarkerBottom === bottomBoundary) {
    if (yMaxDir == 'down') {
      state.isScrolling = false;
    } else if (outlineMarkerTop < topBoundary) {
      state.isScrolling = true;
    } else {
      state.isScrolling = false;
    }
  } else {
    state.isScrolling = true;
  }

  // Update scrollNeeded global variable
  // Also update isScrolling to be more precise
  if (state.isScrolling) {
    state.scrollNeeded =
      yMaxDir == 'up'
        ? outlineMarkerTop - topBoundary
        : outlineMarkerBottom - bottomBoundary;

    const curScrollTop = tocHolder.scrollTop;
    const maxScrollTop = tocHolder.scrollHeight - tocHolder.clientHeight;
    const freeScrollTop = curScrollTop + state.scrollNeeded;

    if (freeScrollTop < 0) {
      state.scrollNeeded = -curScrollTop;
    } else if (freeScrollTop > maxScrollTop) {
      state.scrollNeeded = maxScrollTop - curScrollTop;
    }

    if (!state.scrollNeeded) state.isScrolling = false;
    state.timeFrac = 0;
    state.motorcycleScrollingStartTime = curTimestamp;
    state.motorcycleScrollingStartScrollTop = curScrollTop;
  }
}
