export interface ScrollInfo {
  topScrollNeeded: boolean;
  bottomScrollNeeded: boolean;
}

export function doAutoScroll(
  tocHolder: HTMLElement,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
  scrollInfo: ScrollInfo,
) {
  const curScrollTop = tocHolder.scrollTop;
  const tocHolderInnerHeight = tocHolder.clientHeight;
  const topBoundary = curScrollTop + offset;
  const bottomBoundary = curScrollTop + tocHolderInnerHeight - offset;

  if (outlineMarkerBottom > bottomBoundary) {
    const overflowBottom = outlineMarkerBottom - bottomBoundary;
    if (scrollInfo.bottomScrollNeeded) {
      tocHolder.scrollTop = curScrollTop + overflowBottom;
    }
  }

  if (outlineMarkerTop < topBoundary) {
    const overflowTop = topBoundary - outlineMarkerTop;
    if (scrollInfo.topScrollNeeded) {
      tocHolder.scrollTop = curScrollTop - overflowTop;
    }
  }
}

export function updateScrollInfo(
  tocHolder: HTMLElement,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
  scrollInfo: ScrollInfo,
) {
  const curScrollTop = tocHolder.scrollTop;
  const tocHolderInnerHeight = tocHolder.clientHeight;
  const topBoundary = curScrollTop + offset;
  const bottomBoundary = curScrollTop + tocHolderInnerHeight - offset;

  if (outlineMarkerBottom > bottomBoundary) {
    scrollInfo.bottomScrollNeeded = false;
  } else {
    scrollInfo.bottomScrollNeeded = true;
  }

  if (outlineMarkerTop < topBoundary) {
    scrollInfo.topScrollNeeded = false;
  } else {
    scrollInfo.topScrollNeeded = true;
  }
}
