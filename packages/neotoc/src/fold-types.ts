export interface FoldState {
  isFolded: boolean;
  level: number;
  toggleFold: () => void;
}

export type FoldStates = FoldState[];

export type FoldStatus = 'none' | 'allFolded' | 'allUnfolded' | 'mixed';
