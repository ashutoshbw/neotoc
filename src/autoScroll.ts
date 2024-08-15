let isScrolling: boolean = false;
let wasTopEndAboveTopBoundary: null | boolean = null;
let wasBottomEndBelowBottomBoundary: null | boolean = null;
let timeFrac = 0;
let scrollNeeded = 0;

export interface AutoScrollProps {
  yMaxDir?: 'up' | 'down';
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
  tocHolder,
  outlineMarkerTop,
  outlineMarkerBottom,
  offset,
  scrollBehavior,
}: AutoScrollProps) {
  const [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  const isTopEndAboveTopBoundary = outlineMarkerTop < topBoundary;
  const isBottomEndBelowBottomBoundary = outlineMarkerBottom > bottomBoundary;

  wasTopEndAboveTopBoundary = isTopEndAboveTopBoundary;
  wasBottomEndBelowBottomBoundary = isBottomEndBelowBottomBoundary;

  if (isScrolling) {
    const curScrollTop = tocHolder.scrollTop;
    if (scrollBehavior == 'instant') {
      tocHolder.scrollTop = curScrollTop + scrollNeeded;
      isScrolling = false;
    } else {
      // TODO
    }
  }
}

export function doAutoScroll({
  yMaxDir,
  tocHolder,
  outlineMarkerTop,
  outlineMarkerBottom,
  offset,
}: AutoScrollProps) {
  const curScrollTop = tocHolder.scrollTop;
  let [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  const isTopEndAboveTopBoundary = outlineMarkerTop < topBoundary;
  const isBottomEndBelowBottomBoundary = outlineMarkerBottom > bottomBoundary;

  if (wasTopEndAboveTopBoundary === null)
    wasTopEndAboveTopBoundary = isTopEndAboveTopBoundary;
  if (wasBottomEndBelowBottomBoundary === null)
    wasBottomEndBelowBottomBoundary = isBottomEndBelowBottomBoundary;

  if (isTopEndAboveTopBoundary && wasTopEndAboveTopBoundary === false) {
    // executed when outlineMarkerTop just went above top boundary
    tocHolder.scrollTop = curScrollTop - (topBoundary - outlineMarkerTop);
    [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  }

  if (
    isBottomEndBelowBottomBoundary &&
    wasBottomEndBelowBottomBoundary === false
  ) {
    // executed when outlineMarkerBottom just went below bottom boundary
    tocHolder.scrollTop = curScrollTop + outlineMarkerBottom - bottomBoundary;
    [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);
  }

  isScrolling = !(
    (outlineMarkerTop === topBoundary && yMaxDir == 'up') ||
    (outlineMarkerBottom === bottomBoundary && yMaxDir == 'down')
  );

  // update scrollNeeded global variable
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
  }
  timeFrac = 0;
}
