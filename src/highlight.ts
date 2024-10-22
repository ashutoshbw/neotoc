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
  const topGradient = elt<HTMLDivElement>('div', 'top-gradient');
  const bottomGradient = elt<HTMLDivElement>('div', 'bottom-gradient');

  bar.append(barTopIndicator, barLight, barBottomIndicator);
  bar.style.display = 'none';

  tocHolder.append(bar, topGradient, bottomGradient);

  let lastActiveAnchors: Array<HTMLAnchorElement> = [];

  function updatePositionGradients() {
    const scrollTop = tocHolder.scrollTop;
    const highestScrollTop = tocHolder.scrollHeight - tocHolder.clientHeight;

    topGradient.style.top = scrollTop + 'px';
    bottomGradient.style.bottom = -scrollTop + 'px';
    topGradient.style.opacity = scrollTop > 5 ? '1' : '0';
    bottomGradient.style.opacity = scrollTop + 5 < highestScrollTop ? '1' : '0';
  }

  updatePositionGradients();

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

        updatePositionGradients();

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
      topGradient.remove();
      bottomGradient.remove();
    },
  };
}
