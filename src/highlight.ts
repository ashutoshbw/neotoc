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
  tocHolder: HTMLElement,
  elt: Elt,
  addClass: ClassModificationFuncType,
  removeClass: ClassModificationFuncType,
  classContains: ClassContains,
): Draw {
  const bar = elt<HTMLDivElement>('div', 'bar');
  const barTopIndicator = elt<HTMLDivElement>('div', 'bar-top-indicator');
  const barLight = elt<HTMLDivElement>('div', 'bar-light');
  const barBottomIndicator = elt<HTMLDivElement>('div', 'bar-bottom-indicator');

  bar.append(barTopIndicator, barLight, barBottomIndicator);
  bar.style.display = 'none';

  tocHolder.append(bar);

  let lastActiveAnchors: Array<HTMLAnchorElement> = [];

  return (highlightedArea) => {
    if (highlightedArea.isVisible) {
      const { top, height, isTopInAFold, isBottomInAFold, anchors } =
        highlightedArea;
      bar.style.display = '';
      bar.style.top = `${top}px`;
      bar.style.height = `${height}px`;

      if (isTopInAFold) addClass(barTopIndicator, 'on-fold');
      else removeClass(barTopIndicator, 'on-fold');

      if (isBottomInAFold) addClass(barBottomIndicator, 'on-fold');
      else removeClass(barBottomIndicator, 'on-fold');

      lastActiveAnchors.forEach((a) => {
        if (!anchors.includes(a)) removeClass(a, 'active-a');
      });
      anchors.forEach((a) => {
        if (!classContains(a, 'active-a')) addClass(a, 'active-a');
      });

      lastActiveAnchors = anchors;
    } else {
      bar.style.display = 'none';
    }
  };
}
