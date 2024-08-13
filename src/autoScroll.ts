export interface ScrollState {
  yMaxDir: null | 'up' | 'down';
  wasTopEndAboveTopBoundary: null | boolean;
  wasBottomEndBelowBottomBoundary: null | boolean;
}

export interface AutoScrollProps {
  state: ScrollState;
  tocHolder: HTMLElement;
  outlineMarkerTop: number;
  outlineMarkerBottom: number;
  offset: number;
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
}: AutoScrollProps) {
  const [topBoundary, bottomBoundary] = getBoundaries(tocHolder, offset);

  state.wasTopEndAboveTopBoundary = outlineMarkerTop < topBoundary;
  state.wasBottomEndBelowBottomBoundary = outlineMarkerBottom > bottomBoundary;
}

export function doAutoScroll({
  state,
  tocHolder,
  outlineMarkerTop,
  outlineMarkerBottom,
  offset,
}: AutoScrollProps) {
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
    tocHolder.scrollTop = curScrollTop - (topBoundary - outlineMarkerTop);
  }

  if (
    isBottomEndBelowBottomBoundary &&
    state.wasBottomEndBelowBottomBoundary === false
  ) {
    // executed when outlineMarkerBottom just went below bottom boundary
    tocHolder.scrollTop = curScrollTop + outlineMarkerBottom - bottomBoundary;
  }
}
