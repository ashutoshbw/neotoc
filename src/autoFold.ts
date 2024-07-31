import { type FoldStates } from './fold-types.js';

export function doAutoFold(
  foldStates: FoldStates,
  anchorsToSectionsInView: HTMLAnchorElement[],
  tocHolder: HTMLElement,
) {
  for (let i = 0; i < foldStates.length; i++) {
    const { anchor, isFolded, toggleFold } = foldStates[i];

    if (anchorsToSectionsInView.length) {
      if (anchorsToSectionsInView.includes(anchor)) {
        if (isFolded) toggleFold();
      } else if (ifAncestorAnchor(anchor, anchorsToSectionsInView, tocHolder)) {
        if (isFolded) toggleFold();
      } else {
        if (!isFolded) toggleFold();
      }
    } else {
      if (!isFolded) {
        toggleFold();
      }
    }
  }
}

function getParentAnchorsInToc(
  anchor: HTMLAnchorElement,
  tocHolder: HTMLElement,
): HTMLAnchorElement[] {
  const foldableDivOrTocHolder =
    anchor.parentElement!.parentElement!.parentElement!;

  if (foldableDivOrTocHolder === tocHolder) return [];

  const aboveAnchor = foldableDivOrTocHolder!
    .previousSibling! as HTMLAnchorElement;

  return [aboveAnchor, ...getParentAnchorsInToc(aboveAnchor, tocHolder)];
}

function ifAncestorAnchor(
  possibleParent: HTMLAnchorElement,
  anchorsInView: HTMLAnchorElement[],
  tocHolder: HTMLElement,
) {
  for (let i = 0; i < anchorsInView.length; i++) {
    const a = anchorsInView[i];
    const aboveAnchors = getParentAnchorsInToc(a, tocHolder);

    if (aboveAnchors.includes(possibleParent)) {
      return true;
    }
  }
  return false;
}
