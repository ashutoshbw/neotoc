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

interface Frame {
  draw: Draw;
  cleanup: () => void;
}

type Elt = <T extends HTMLElement>(type: string, className?: string) => T;

export function addHighlight({
  tocHolder,
  elt,
}: {
  tocHolder: HTMLElement;
  elt: Elt;
}): Frame {
  const bar = elt<HTMLDivElement>('div', 'bar');
  const barTopIndicator = elt<HTMLDivElement>('div', 'bar-top-indicator');
  const barLight = elt<HTMLDivElement>('div', 'bar-light');
  const barBottomIndicator = elt<HTMLDivElement>('div', 'bar-bottom-indicator');

  bar.append(barTopIndicator, barLight, barBottomIndicator);
  bar.style.display = 'none';

  tocHolder.append(bar);

  let lastActiveAnchors: Array<HTMLAnchorElement> = [];

  return {
    draw(highlightedArea) {
      if (highlightedArea.isVisible) {
        const { top, height, isTopInAFold, isBottomInAFold, anchors } =
          highlightedArea;
        bar.style.display = '';
        bar.style.top = `${top}px`;
        bar.style.height = `${height}px`;

        if (isTopInAFold) barTopIndicator.classList.add('onFold');
        else barTopIndicator.classList.remove('onFold');

        if (isBottomInAFold) barBottomIndicator.classList.add('onFold');
        else barBottomIndicator.classList.remove('onFold');

        lastActiveAnchors.forEach((a) => {
          if (!anchors.includes(a)) a.classList.remove('active-a');
        });
        anchors.forEach((a) => {
          if (!a.classList.contains('active-a')) a.classList.add('active-a');
        });

        lastActiveAnchors = anchors;
      } else {
        bar.style.display = 'none';
      }
    },
    cleanup() {
      bar.remove();
    },
  };
}
