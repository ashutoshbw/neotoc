import { createContext, SetStateAction, Dispatch } from "react";

type TocContextType = {
  toc: HTMLDivElement | null;
  autoFold: boolean;
  setAutoFold: Dispatch<SetStateAction<boolean>>;
  ellipsis: boolean;
  setEllipsis: Dispatch<SetStateAction<boolean>>;
  relativeFontSize: number;
  setRelativeFontSize: Dispatch<SetStateAction<number>>;
  indentLineGap: number;
  setIndentLineGap: Dispatch<SetStateAction<number>>;
  toggleFoldBtnWidth: number;
  setToggleFoldBtnWidth: Dispatch<SetStateAction<number>>;
} | null;

export const TocContext = createContext<TocContextType>(null);
