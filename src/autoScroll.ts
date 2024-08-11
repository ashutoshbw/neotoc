export interface ScrollInfo {
  upScrollNeeded: boolean;
  downScrollNeeded: boolean;
  bigUpScrollNeeded: boolean;
  bigDownScrollNeeded: boolean;
  bigTopOverflow: number;
  bigBottomOverflow: number;
  scrollDir: 'up' | 'down'; // scroll is detected using change in top and bottom change in outlineMarker, so viewportsize change also can cause a scroll which is not technically a scroll, but that's not a problem.
  timeLeft: number;
  isScrolling: boolean;
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

  if (
    (scrollInfo.bigUpScrollNeeded && scrollInfo.scrollDir == 'up') ||
    (scrollInfo.bigDownScrollNeeded && scrollInfo.scrollDir == 'down')
  ) {
    // TODO: only do if smooth scrolling enabled, may be
    scrollInfo.isScrolling = true;
  }
}

// TODO: bigUpScrollNeeded and bigDownScrollNeeded to false when scrolling is done
export function scrollIntoViewIfNeeded(
  tocHolder: HTMLElement,
  scrollInfo: ScrollInfo,
  isSmooth: boolean,
  curTimestamp: number,
  lastTimestamp: number | null,
  autoScrollDuration: number,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
) {
  const curScrollTop = tocHolder.scrollTop;
  const tocHolderInnerHeight = tocHolder.clientHeight;
  const topBoundary = curScrollTop + offset;
  const bottomBoundary = curScrollTop + tocHolderInnerHeight - offset;

  if (isSmooth) {
    if (lastTimestamp !== null) {
      if (scrollInfo.isScrolling) {
        if (scrollInfo.timeLeft > 0) {
          const timeDiff = curTimestamp - lastTimestamp;
          if (scrollInfo.bigUpScrollNeeded && scrollInfo.scrollDir == 'up') {
            scrollInfo.bigTopOverflow = topBoundary - outlineMarkerTop;
            const distanceToBeScrolled =
              (scrollInfo.bigTopOverflow / scrollInfo.timeLeft) * timeDiff;
            tocHolder.scrollTop = curScrollTop - distanceToBeScrolled;
            scrollInfo.timeLeft = scrollInfo.timeLeft - timeDiff;
            // console.log('top', distanceToBeScrolled);
          }

          if (
            scrollInfo.bigDownScrollNeeded &&
            scrollInfo.scrollDir == 'down'
          ) {
            scrollInfo.bigBottomOverflow = outlineMarkerBottom - bottomBoundary;
            const distanceToBeScrolled =
              (scrollInfo.bigBottomOverflow / scrollInfo.timeLeft) * timeDiff;
            tocHolder.scrollTop = curScrollTop + distanceToBeScrolled;
            scrollInfo.timeLeft = scrollInfo.timeLeft - timeDiff;
            // console.log('bottom', distanceToBeScrolled);
          }
        } else {
          scrollInfo.timeLeft = autoScrollDuration;
          scrollInfo.bigDownScrollNeeded = false;
          scrollInfo.bigUpScrollNeeded = false;
          scrollInfo.isScrolling = false;
        }
      }
    }
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
  // if (scrollInfo.bigUpScrollNeeded == false) {
  if (outlineMarkerTop < topBoundary) {
    scrollInfo.upScrollNeeded = false;
    scrollInfo.bigUpScrollNeeded = true;
    // console.log('set up true');
  } else {
    scrollInfo.upScrollNeeded = true;
  }
  // }

  // because of manually scrolling the tocHolder
  // if (scrollInfo.bigDownScrollNeeded == false) {
  if (outlineMarkerBottom > bottomBoundary) {
    scrollInfo.downScrollNeeded = false;
    scrollInfo.bigDownScrollNeeded = true;
    // console.log('set down true');
  } else {
    scrollInfo.downScrollNeeded = true;
  }
  // }

  // console.log(
  //   'isScrolling',
  //   scrollInfo.isScrolling,
  //   scrollInfo.bigUpScrollNeeded,
  //   scrollInfo.bigDownScrollNeeded,
  // );
}
