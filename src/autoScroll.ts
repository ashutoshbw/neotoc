export interface ScrollInfo {
  scrollDir: 'up' | 'down'; // scroll is detected using change in top and bottom change in outlineMarker, so viewportsize change also can cause a scroll which is not technically a scroll, but that's not a problem.
}
