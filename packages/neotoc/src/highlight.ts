export type HighlightedArea =
  | {
      top: number;
      bottom: number;
      height: number;
      isTopInAFold: boolean;
      isBottomInAFold: boolean;
      anchors: HTMLAnchorElement[];
      isVisible: true;
      time: number;
    }
  | {
      isVisible: false;
      time: number;
    };

export type Draw = (highlightedArea: HighlightedArea) => void;

type Elt = <T extends HTMLElement>(type: string, className?: string) => T;
type ClassModificationFuncType = (elt: HTMLElement, className: string) => void;
type ClassContains = (elt: HTMLElement, className: string) => boolean;

export function addHighlight(
  tocBody: HTMLElement,
  elt: Elt,
  addClass: ClassModificationFuncType,
  removeClass: ClassModificationFuncType,
  classContains: ClassContains,
): Draw {
  const bar = elt<HTMLDivElement>('div', 'light-bar');
  const barTopIndicator = elt<HTMLDivElement>('div', 'light-bar-top');
  const light = elt<HTMLDivElement>('div', 'light');
  const barBottomIndicator = elt<HTMLDivElement>('div', 'light-bar-bottom');

  bar.append(barTopIndicator, light, barBottomIndicator);
  bar.style.position = 'absolute'; // setting it here instead of in CSS file is to avoid having any initial flicker caused by light bar without the CSS file applied.
  bar.style.display = 'none';

  tocBody.append(bar);

  let lastEnlightendAnchors: Array<HTMLAnchorElement> = [];

  const onFoldClassName = 'on-fold';
  const enlightendAnchorClassName = 'enlightend-a';

  return (highlightedArea) => {
    if (highlightedArea.isVisible) {
      const { top, height, isTopInAFold, isBottomInAFold, anchors } =
        highlightedArea;
      bar.style.display = '';
      bar.style.top = `${top}px`;
      bar.style.height = `${height}px`;

      if (isTopInAFold) addClass(barTopIndicator, onFoldClassName);
      else removeClass(barTopIndicator, onFoldClassName);

      if (isBottomInAFold) addClass(barBottomIndicator, onFoldClassName);
      else removeClass(barBottomIndicator, onFoldClassName);

      lastEnlightendAnchors.forEach((a) => {
        if (!anchors.includes(a)) removeClass(a, enlightendAnchorClassName);
      });
      anchors.forEach((a) => {
        if (!classContains(a, enlightendAnchorClassName))
          addClass(a, enlightendAnchorClassName);
      });

      lastEnlightendAnchors = anchors;
    } else {
      bar.style.display = 'none';
      lastEnlightendAnchors.forEach((a) =>
        removeClass(a, enlightendAnchorClassName),
      );
    }
  };
}
