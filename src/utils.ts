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

type VerticalBoundary = [null, null] | [number, number];

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
    if (eY2 > cY1) {
      y1 = cY1;
    }
  } else if (eY1 < cY2) {
    y1 = eY1;
  }

  if (eY2 <= cY2) {
    if (eY2 > cY1) {
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
) {
  const [y1, y2] = getYLimits(rootElt);
  const [ym1, ym2] = [y1 + marginTop, y2 - marginBottom];

  const parentContainer = rootElt.parentElement;

  if (parentContainer) return getCroppedYLimits([ym1, ym2], parentContainer);
  else return [ym1, ym2];
}
