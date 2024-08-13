export interface ScrollState {
  yMaxDir: null | 'up' | 'down';
  wasTopEndAboveTopBoundary: null | boolean;
  wasBottomEndBelowBottomBoundary: null | boolean;
}

export function updateScrollState(
  state: ScrollState,
  tocHolder: HTMLElement,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
) {
  const curScrollTop = tocHolder.scrollTop;
  const tocHolderInnerHeight = tocHolder.clientHeight;
  const topBoundary = curScrollTop + offset;
  const bottomBoundary = curScrollTop + tocHolderInnerHeight - offset;

  state.wasTopEndAboveTopBoundary = outlineMarkerTop < topBoundary;
  state.wasBottomEndBelowBottomBoundary = outlineMarkerBottom > bottomBoundary;
}

export function doAutoScroll(
  state: ScrollState,
  tocHolder: HTMLElement,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
) {
  const curScrollTop = tocHolder.scrollTop;
  const tocHolderInnerHeight = tocHolder.clientHeight;
  const topBoundary = curScrollTop + offset;
  const bottomBoundary = curScrollTop + tocHolderInnerHeight - offset;

  if (state.wasTopEndAboveTopBoundary === null)
    state.wasTopEndAboveTopBoundary = outlineMarkerTop < topBoundary;
  if (state.wasBottomEndBelowBottomBoundary === null)
    state.wasBottomEndBelowBottomBoundary =
      outlineMarkerBottom > bottomBoundary;

  if (
    outlineMarkerTop < topBoundary &&
    state.wasTopEndAboveTopBoundary === false
  ) {
    // executed when outlineMarkerTop just went above top boundary
    tocHolder.scrollTop = curScrollTop - (topBoundary - outlineMarkerTop);
  }

  if (
    outlineMarkerBottom > bottomBoundary &&
    state.wasBottomEndBelowBottomBoundary === false
  ) {
    // executed when outlineMarkerBottom just went below bottom boundary
    tocHolder.scrollTop = curScrollTop + outlineMarkerBottom - bottomBoundary;
  }
}
