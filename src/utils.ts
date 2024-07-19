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
