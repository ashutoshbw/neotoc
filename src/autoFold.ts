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

    if (anchorsToSectionsInView.length) {
      if (anchorsToSectionsInView.includes(anchor)) {
        if (isManuallyNotPoked) {
          if (isFolded) toggleFold();
        } else {
          if (foldStates[i].isOutsideView === true) {
            if (isFolded) {
              toggleFold();
            }
            forgetManualPoking();
          }
        }
        foldStates[i].isOutsideView = false;
      } else if (ifAncestorAnchor(anchor, anchorsToSectionsInView, tocHolder)) {
        if (isFolded) {
          if (isManuallyNotPoked) {
            toggleFold();
          } else {
            if (foldStates[i].isOutsideView === true) {
              forgetManualPoking();
            }
          }
        } else {
          forgetManualPoking();
        }
        foldStates[i].isOutsideView = false;
      } else {
        if (!isFolded) {
          if (isManuallyNotPoked) {
            toggleFold();
          }
        }
        foldStates[i].isOutsideView = true;
      }
    } else {
      if (isFolded) {
        forgetManualPoking();
      } else {
        if (isManuallyNotPoked) {
          toggleFold();
        }
        if (foldStates[i].isOutsideView === false) {
          toggleFold();
        }
      }
      foldStates[i].isOutsideView = true;
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
