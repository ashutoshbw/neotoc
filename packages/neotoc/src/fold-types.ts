export interface FoldState {
  isFolded: boolean;
  level: number;
  toggleFold: () => void;
  foldableDiv: HTMLDivElement;
  anchor: HTMLAnchorElement;
  isManuallyToggledFoldInAutoFold: boolean;
}

export type FoldStates = FoldState[];

export type FoldStatus = 'none' | 'allFolded' | 'allUnfolded' | 'mixed';

export type AutoFoldScrollState = {
  startTime: number;
  duration: number;
  lastTop: number;
  on: boolean;
};
