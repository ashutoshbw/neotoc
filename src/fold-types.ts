export interface FoldState {
  isFolded: boolean;
  level: number;
  toggleFold: () => void;
  foldableDiv: HTMLDivElement;
  anchor: HTMLAnchorElement;
  isManuallyToggledFoldInAutoFold: boolean;
  isOutsideView?: boolean;
}

export type FoldStates = FoldState[];

export type FoldStatus = 'none' | 'allFolded' | 'allUnfolded' | 'mixed';
