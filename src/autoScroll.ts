export interface ScrollState {
  yMaxDir: null | 'up' | 'down';
  wasTopEndAboveTopBoundary: null | boolean;
  wasBottomEndBelowBottomBoundary: null | boolean;
  isScrolling: boolean;
}

export interface AutoScrollProps {
  state: ScrollState;
  tocHolder: HTMLElement;
  outlineMarkerTop: number;
  outlineMarkerBottom: number;
  offset: number;
  scrollBehavior?: 'instant' | 'smooth';
}

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

export function updateScrollState({
  state,
  tocHolder,
  outlineMarkerTop,
  outlineMarkerBottom,
  offset,
  scrollBehavior,
}: AutoScrollProps) {
  const [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  const isTopEndAboveTopBoundary = outlineMarkerTop < topBoundary;
  const isBottomEndBelowBottomBoundary = outlineMarkerBottom > bottomBoundary;

  state.wasTopEndAboveTopBoundary = isTopEndAboveTopBoundary;
  state.wasBottomEndBelowBottomBoundary = isBottomEndBelowBottomBoundary;

  if (state.isScrolling) {
    let scrollNeeded =
      state.yMaxDir == 'up'
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

    if (scrollBehavior == 'instant') {
      tocHolder.scrollTop = curScrollTop + scrollNeeded;
      state.isScrolling = false;
    } else {
      // TODO
    }
  }
}

export function doAutoScroll({
  state,
  tocHolder,
  outlineMarkerTop,
  outlineMarkerBottom,
  offset,
}: AutoScrollProps) {
  const curScrollTop = tocHolder.scrollTop;
  let [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  const isTopEndAboveTopBoundary = outlineMarkerTop < topBoundary;
  const isBottomEndBelowBottomBoundary = outlineMarkerBottom > bottomBoundary;

  if (state.wasTopEndAboveTopBoundary === null)
    state.wasTopEndAboveTopBoundary = isTopEndAboveTopBoundary;
  if (state.wasBottomEndBelowBottomBoundary === null)
    state.wasBottomEndBelowBottomBoundary = isBottomEndBelowBottomBoundary;

  if (isTopEndAboveTopBoundary && state.wasTopEndAboveTopBoundary === false) {
    // executed when outlineMarkerTop just went above top boundary
    tocHolder.scrollTop = curScrollTop - (topBoundary - outlineMarkerTop);
    [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  }

  if (
    isBottomEndBelowBottomBoundary &&
    state.wasBottomEndBelowBottomBoundary === false
  ) {
    // executed when outlineMarkerBottom just went below bottom boundary
    tocHolder.scrollTop = curScrollTop + outlineMarkerBottom - bottomBoundary;
    [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  }

  if (
    !(
      (outlineMarkerTop === topBoundary && state.yMaxDir == 'up') ||
      (outlineMarkerBottom === bottomBoundary && state.yMaxDir == 'down')
    )
  ) {
    state.isScrolling = true;
  } else {
    state.isScrolling = false;
  }
}
