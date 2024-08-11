export interface ScrollInfo {
  upScrollNeeded: boolean;
  downScrollNeeded: boolean;
  bigUpScrollNeeded: boolean;
  bigDownScrollNeeded: boolean;
  bigTopOverflow: number;
  bigBottomOverflow: number;
  scrollDir: 'up' | 'down'; // scroll is detected using change in top and bottom change in outlineMarker, so viewportsize change also can cause a scroll which is not technically a scroll, but that's not a problem.
  timeLeft: number;
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

  if (outlineMarkerTop < topBoundary) {
    const overflowTop = topBoundary - outlineMarkerTop;
    if (scrollInfo.upScrollNeeded && scrollInfo.scrollDir == 'up') {
      tocHolder.scrollTop = curScrollTop - overflowTop;
    }
  }

  if (outlineMarkerBottom > bottomBoundary) {
    const overflowBottom = outlineMarkerBottom - bottomBoundary;
    if (scrollInfo.downScrollNeeded && scrollInfo.scrollDir == 'down') {
      tocHolder.scrollTop = curScrollTop + overflowBottom;
    }
  }

  // The logic below initiates smooth scrolling when manually
  // the toc has scrolled in a way that the outline marker
  // crosses the tocHolder's upper and lower content edge.
  if (scrollInfo.bigUpScrollNeeded && scrollInfo.bigDownScrollNeeded) {
    // TODO: decide based on scrollInfo.tocScrollDir
  } else if (scrollInfo.bigUpScrollNeeded) {
    scrollInfo.bigTopOverflow = topBoundary - outlineMarkerTop;
  } else if (scrollInfo.bigDownScrollNeeded) {
    scrollInfo.bigBottomOverflow = outlineMarkerBottom - bottomBoundary;
  }
}

// TODO: bigUpScrollNeeded and bigDownScrollNeeded to false when scrolling is done
export function scrollIntoViewIfNeeded(
  tocHolder: HTMLElement,
  scrollInfo: ScrollInfo,
  isSmooth: boolean,
) {
  const curScrollTop = tocHolder.scrollTop;

  if (isSmooth) {
    // TODO
  } else {
    if (scrollInfo.bigUpScrollNeeded && scrollInfo.bigDownScrollNeeded) {
      // TODO: decide based on scrollInfo.tocScrollDir
    } else if (scrollInfo.bigUpScrollNeeded) {
      tocHolder.scrollTop = curScrollTop - scrollInfo.bigTopOverflow;
      scrollInfo.bigUpScrollNeeded = false;
    } else if (scrollInfo.bigDownScrollNeeded) {
      tocHolder.scrollTop = curScrollTop + scrollInfo.bigBottomOverflow;
      scrollInfo.bigDownScrollNeeded = false;
    }
    scrollInfo.timeLeft = 1000; // TODO: set initial time;
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

  // because of manually scrolling the tocHolder
  if (outlineMarkerTop < topBoundary) {
    scrollInfo.upScrollNeeded = false;
    if (outlineMarkerTop <= curScrollTop) {
      scrollInfo.bigUpScrollNeeded = true;
    }
  } else {
    scrollInfo.upScrollNeeded = true;
  }

  // because of manually scrolling the tocHolder
  if (outlineMarkerBottom > bottomBoundary) {
    scrollInfo.downScrollNeeded = false;
    if (outlineMarkerBottom >= curScrollTop + tocHolderInnerHeight) {
      scrollInfo.bigDownScrollNeeded = true;
    }
  } else {
    scrollInfo.downScrollNeeded = true;
  }
}
