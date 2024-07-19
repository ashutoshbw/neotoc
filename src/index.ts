import { elt, fillElt } from './utils.js';

interface Options {
  content: HTMLElement;
  headings: HTMLHeadingElement[] | NodeListOf<HTMLHeadingElement>;
  tocHolder?: HTMLElement;
  fillAnchor: (heading: HTMLHeadingElement, order: number[]) => string | Node;
  listType?: 'ul' | 'ol';
  root?: HTMLElement;
  rootMarginTop?: number;
  rootMarginBottom?: number;
  autoFold?: boolean;
  liContainerClass?: string;
  liClass?: string;
  anchorClass?: string;
  foldable?: boolean;
  foldButtonClass?: string;
  foldButtonFoldedClass?: string;
  foldButtonPos?: 'start' | 'end';
  fillFoldButton: (isFolded: boolean) => string | Node;
  foldableDivClass?: string;
  foldableDivFoldedClass?: string;
  initialFoldLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export default function tocMirror({
  headings,
  tocHolder,
  liContainerClass = 'tm-li-container',
  liClass,
  anchorClass = 'tm-anchor',
  fillAnchor,
  listType = 'ul',
  foldable = false,
  foldButtonPos = 'start',
  foldButtonClass = 'tm-fold-btn',
  foldButtonFoldedClass,
  foldableDivClass = 'tm-foldable-div',
  foldableDivFoldedClass = 'tm-foldable-div-folded',
  fillFoldButton,
  initialFoldLevel = 1,
  autoFold = false,
}: Options) {
  const foldState = [];

  function genToc(
    headings: HTMLHeadingElement[] | NodeListOf<HTMLHeadingElement>,
    order: number[] = [],
  ) {
    order.push(1);
    const listContainer = elt<HTMLUListElement | HTMLOListElement>(
      listType,
      liContainerClass,
    );

    for (let i = 0; i < headings.length; i++) {
      const h = headings[i];
      const li = elt<HTMLLIElement>('li', liClass);
      const anchor = elt<HTMLAnchorElement>('a', anchorClass);
      anchor.href = `#${h.id}`;
      fillElt(anchor, fillAnchor(h, order));

      li.append(anchor);

      const subHeadings = [];
      const curHeadingLevel = +h.tagName[1];
      for (let j = i + 1; j < headings.length; j++) {
        if (+headings[j].tagName[1] > curHeadingLevel) {
          subHeadings.push(headings[j]);
        } else {
          break;
        }
      }

      if (subHeadings.length > 0) {
        const nestedListContainer = genToc(subHeadings, order);

        if (foldable) {
          const foldButton = elt<HTMLButtonElement>('button', foldButtonClass);
          const foldableDiv = elt<HTMLDivElement>('div', foldableDivClass);
          const isFolded = curHeadingLevel >= initialFoldLevel;
          fillElt(foldButton, fillFoldButton(isFolded));

          console.log('is folded', isFolded);
          if (isFolded) {
            foldableDiv.classList.add(foldableDivFoldedClass);
            if (foldButtonFoldedClass) {
              foldButton.classList.add(foldableDivFoldedClass);
            }
          }

          foldButtonPos == 'start'
            ? li.prepend(foldButton)
            : li.append(foldButton);
          foldableDiv.append(nestedListContainer);
          li.append(foldableDiv);

          const curFoldState = {
            isFolded,
            level: curHeadingLevel,
            toggleFold() {
              curFoldState.isFolded = !curFoldState.isFolded;

              foldableDiv.classList.toggle(foldableDivFoldedClass);
              if (foldButtonFoldedClass) {
                foldButton.classList.toggle(foldButtonFoldedClass);
              } else {
                fillElt(foldButton, fillFoldButton(curFoldState.isFolded));
              }
            },
            foldableDiv, // might be useful in future
            anchor, // only useful in autoFold
            isUserFolding: false, // only useful in autoFold
          };

          foldState.push(curFoldState);

          foldButton.addEventListener('click', () => {
            curFoldState.isUserFolding = true;
            curFoldState.toggleFold();
          });
        } else {
          li.append(nestedListContainer);
        }
      }
      listContainer.append(li);
      order[order.length - 1]++;
      i = i + subHeadings.length;
    }
    order.pop();
    return listContainer;
  }

  const toc = genToc(headings);
  tocHolder?.append(toc);

  return {
    element: toc,
    // setupMirror() {},
    // reflect() {},
    // refresh() {},
    // remove() {},
  };
}
