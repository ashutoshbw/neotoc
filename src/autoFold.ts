import { type FoldStates } from './fold-types.js';

export function doAutoFold(
  foldStates: FoldStates,
  anchorsToSectionsInView: HTMLAnchorElement[],
  tocHolder: HTMLElement,
) {
  for (let i = 0; i < foldStates.length; i++) {
    const { anchor, isFolded, toggleFold } = foldStates[i];

    const isManuallyNotPoked = !foldStates[i].isManuallyToggledFoldInAutoFold;
    const forgetManualPoking = () => {
      foldStates[i].isManuallyToggledFoldInAutoFold = false;
    };
    const wasOutsideView = () => foldStates[i].wasOutsideView === true;
    const wasInsideView = () => foldStates[i].wasOutsideView === false;
    const setWasOutsideView = (b: boolean) =>
      (foldStates[i].wasOutsideView = b);

    if (anchorsToSectionsInView.length) {
      if (anchorsToSectionsInView.includes(anchor)) {
        if (isManuallyNotPoked) {
          if (isFolded) toggleFold();
        } else if (wasOutsideView()) {
          // means if it was not in view just before, do these:
          if (isFolded) toggleFold();
          forgetManualPoking();
        }
        setWasOutsideView(false);
      } else if (ifAncestorAnchor(anchor, anchorsToSectionsInView, tocHolder)) {
        if (isFolded) {
          if (isManuallyNotPoked) {
            toggleFold();
          } else if (wasOutsideView()) {
            forgetManualPoking();
          }
        } else {
          forgetManualPoking();
        }
        setWasOutsideView(false); // I consider this inside view for sensible folding
      } else {
        if (!isFolded && isManuallyNotPoked) toggleFold();
        setWasOutsideView(true);
      }
    } else {
      if (isFolded) {
        forgetManualPoking();
      } else {
        if (isManuallyNotPoked) {
          toggleFold();
        } else if (wasInsideView()) {
          toggleFold();
        }
      }
      setWasOutsideView(true);
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
