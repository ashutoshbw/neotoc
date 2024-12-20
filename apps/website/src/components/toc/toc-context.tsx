import { createContext, SetStateAction, Dispatch } from "react";

type TocContextType = {
  toc: HTMLDivElement | null;
  autoFold: boolean;
  setAutoFold: Dispatch<SetStateAction<boolean>>;
  relativeFontSize: number;
  setRelativeFontSize: Dispatch<SetStateAction<number>>;
  indentLineGap: number;
  setIndentLineGap: Dispatch<SetStateAction<number>>;
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
} | null;

export const TocContext = createContext<TocContextType>(null);
