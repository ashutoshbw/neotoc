export function elt<T extends HTMLElement>(
  type: string,
  className?: string,
): T {
  const e = document.createElement(type) as T;
  if (className) e.className = className;
  return e;
}

export function fillElt(elt: HTMLElement, fill: Node | string) {
  if (typeof fill == 'string') {
    elt.innerHTML = fill;
  } else {
    elt.replaceChildren(fill);
  }
}

function getYLimits(elt: HTMLElement): [number, number] {
  if (elt === document.documentElement) return [0, elt.clientHeight];

  const y1 = elt.getBoundingClientRect().y + elt.clientTop;
  const y2 = y1 + elt.clientHeight;

  return [y1, y2];
}

type VerticalBoundary = [null | number, null | number];

function getCroppedYLimits(
  [eY1, eY2]: VerticalBoundary,
  container: HTMLElement,
): VerticalBoundary {
  const [cY1, cY2] = getYLimits(container);

  let y1 = null,
    y2 = null;

  // Note that if eY1 is null, eY2 must be null too.
  if (eY1 === null) return [eY1, eY2];

  if (eY1 <= cY1) {
    if (eY2! > cY1) {
      y1 = cY1;
    }
  } else if (eY1 < cY2) {
    y1 = eY1;
  }

  if (eY2! <= cY2) {
    if (eY2! > cY1) {
      y2 = eY2;
    }
  } else if (eY1 < cY2) {
    y2 = cY2;
  }

  if (container === document.documentElement)
    return [y1, y2] as VerticalBoundary;
  else
    return getCroppedYLimits(
      [y1, y2] as VerticalBoundary,
      container.parentElement as HTMLElement,
    );
}

export function getViewportYSize(
  rootElt: HTMLElement,
  marginTop: number,
  marginBottom: number,
): VerticalBoundary {
  const [y1, y2] = getYLimits(rootElt);
  const [ym1, ym2] = [y1 + marginTop, y2 - marginBottom];

  const parentContainer = rootElt.parentElement;

  if (parentContainer) return getCroppedYLimits([ym1, ym2], parentContainer);
  else return [ym1, ym2];
}

// credit: https://gist.github.com/wojtekmaj/fe811af47fad12a7265b6f7df1017c83
export function findScrollContainer(element: HTMLElement) {
  let parent = element.parentElement;
  while (parent) {
    const { overflow } = window.getComputedStyle(parent);
    if (overflow.split(' ').every((o) => o === 'auto' || o === 'scroll')) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return document.documentElement;
}

function getClosestFoldableDiv(
  elt: HTMLAnchorElement | HTMLDivElement,
  foldableDivClass: string,
  foldButtonUsed: boolean,
) {
  // it assumes elt is an anchor or foldable div that is inside generated toc
  // and that generated toc is in tocHolder

  let mayBeClosestFoldableDiv =
    elt.parentElement!.parentElement!.parentElement!;
  if (elt.tagName === 'A' && foldButtonUsed)
    mayBeClosestFoldableDiv = mayBeClosestFoldableDiv.parentElement!;

  if (mayBeClosestFoldableDiv.classList.contains(foldableDivClass)) {
    return mayBeClosestFoldableDiv as HTMLDivElement;
  } else {
    return null;
  }
}

export function getAncestors(
  anchor: HTMLAnchorElement,
  foldableDivClass: string,
  foldButtonUsed: boolean,
  foldButtonPos: 'start' | 'end',
): [HTMLDivElement[], HTMLAnchorElement[]] {
  const ancestorDivs: HTMLDivElement[] = [];
  const ancestorAnchors: HTMLAnchorElement[] = [];
  let ancestorDiv = getClosestFoldableDiv(
    anchor,
    foldableDivClass,
    foldButtonUsed,
  );

  while (ancestorDiv) {
    ancestorDivs.push(ancestorDiv);

    if (foldButtonUsed) {
      const anchorSpan = ancestorDiv.previousSibling! as HTMLSpanElement;
      const ancestorAnchor =
        foldButtonPos == 'start'
          ? (anchorSpan.lastChild! as HTMLAnchorElement)
          : (anchorSpan.firstChild! as HTMLAnchorElement);
      ancestorAnchors.push(ancestorAnchor);
    } else {
      ancestorAnchors.push(ancestorDiv.previousSibling! as HTMLAnchorElement);
    }

    ancestorDiv = getClosestFoldableDiv(
      ancestorDiv,
      foldableDivClass,
      foldButtonUsed,
    );
  }

  return [ancestorDivs, ancestorAnchors];
}

export function calculateYBasedOnFolding(
  foldableDivs: HTMLDivElement[],
  startingY: number,
) {
  let minY = startingY;
  for (let i = 0; i < foldableDivs.length; i++) {
    const y = foldableDivs[i].getBoundingClientRect().bottom;
    if (y < minY) minY = y;
  }
  return minY;
}
