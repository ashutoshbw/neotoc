import { type FoldStates } from './fold-types.js';

export function doAutoFold(
  foldStates: FoldStates,
  anchorsToSectionsInView: HTMLAnchorElement[],
  anchorToAncestorAnchorsMap: Map<HTMLAnchorElement, HTMLAnchorElement[]>,
) {
  for (let i = 0; i < foldStates.length; i++) {
    const { anchor, isFolded, toggleFold } = foldStates[i];

    const isManuallyNotToggled = !foldStates[i].isManuallyToggledFoldInAutoFold;
    const forgetManualToggling = () => {
      foldStates[i].isManuallyToggledFoldInAutoFold = false;
    };
    const toggleFoldIfNeeded = () => {
      if (isManuallyNotToggled) toggleFold();
    };
    const handleOutsideViewCase = () => {
      if (isFolded) {
        forgetManualToggling();
      } else {
        toggleFoldIfNeeded();
      }
    };

    if (anchorsToSectionsInView.length) {
      if (
        anchorsToSectionsInView.includes(anchor) ||
        ifAncestorAnchor(
          anchor,
          anchorsToSectionsInView,
          anchorToAncestorAnchorsMap,
        )
      ) {
        if (isFolded) {
          toggleFoldIfNeeded();
        } else {
          forgetManualToggling();
        }
      } else handleOutsideViewCase();
    } else handleOutsideViewCase();
  }
}

function ifAncestorAnchor(
  possibleParent: HTMLAnchorElement,
  anchorsInView: HTMLAnchorElement[],
  anchorToAncestorAnchorsMap: Map<HTMLAnchorElement, HTMLAnchorElement[]>,
) {
  for (let i = 0; i < anchorsInView.length; i++) {
    const a = anchorsInView[i];
    const ancestorAnchors = anchorToAncestorAnchorsMap.get(a)!;

    if (ancestorAnchors.includes(possibleParent)) {
      return true;
    }
  }
  return false;
}
