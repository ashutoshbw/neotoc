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
  indentLineWidth: number;
  setIndentLineWidth: Dispatch<SetStateAction<number>>;
  anchorPaddingBlock: number;
  setAnchorPaddingBlock: Dispatch<SetStateAction<number>>;
  anchorPaddingInline: number;
  setAnchorPaddingInline: Dispatch<SetStateAction<number>>;
  anchorBorderRadius: number;
  setAnchorBorderRadius: Dispatch<SetStateAction<number>>;
  paddingLeft: number;
  setPaddingLeft: Dispatch<SetStateAction<number>>;
  lightBarWidth: number;
  setLightBarWidth: Dispatch<SetStateAction<number>>;
  lightBarTipRadius: number;
  setLightBarTipRadius: Dispatch<SetStateAction<number>>;
  lightSpreadLength: number;
  setLightSpreadLength: Dispatch<SetStateAction<number>>;
  foldingDuration: number;
  setFoldingDuration: Dispatch<SetStateAction<number>>;
} | null;

export const TocContext = createContext<TocContextType>(null);
