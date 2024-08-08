export function doAutoScroll(
  tocHolder: HTMLElement,
  outlineMarkerTop: number,
  outlineMarkerBottom: number,
  offset: number,
) {
  const curScrollTop = tocHolder.scrollTop;
  const tocHolderInnerHeight = tocHolder.clientHeight;
  const topBoundary = curScrollTop + offset;
  const bottomBoundary = curScrollTop + tocHolderInnerHeight - offset;

  if (outlineMarkerBottom > bottomBoundary) {
    const overflow = outlineMarkerBottom - bottomBoundary;
    tocHolder.scrollTop = curScrollTop + overflow;
  }

  if (outlineMarkerTop < topBoundary) {
    const overflow = topBoundary - outlineMarkerTop;
    tocHolder.scrollTop = curScrollTop - overflow;
  }
}
