"use client";
import { useState, useEffect } from "react";
import neotoc from "neotoc";
import { TocContext } from "./toc-context";
import "./neotoc.css";
import "./themes.css";

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [toc, setToc] = useState<HTMLDivElement | null>(null);
  const [autoFold, setAutoFold] = useState(false);
  const [relativeFontSize, setRelativeFontSize] = useState(94);
  const [indentLineGap, setIndentLineGap] = useState(5);
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    const removeToc = neotoc({
      io: "article >> h* >> #sidebar",
      autoFold: autoFold,
    });
    const tocWidget = document.querySelector<HTMLDivElement>(
      "#sidebar .nt-widget"
    );
    setToc(tocWidget);
    return removeToc;
  }, [autoFold]);

  useEffect(() => {
    toc?.style.setProperty("--relative-font-size", `${relativeFontSize}`);
    toc?.style.setProperty("--indent-line-gap", `${indentLineGap}px`);
    if (theme !== "default") {
      console.log(theme);
      if (toc) {
        toc.dataset.theme = theme;
      }
    } else {
      if (toc) {
        delete toc.dataset.theme;
      }
    }
  }, [toc, relativeFontSize, indentLineGap, theme]);

  return (
    <TocContext.Provider
      value={{
        toc,
        autoFold,
        setAutoFold,
        indentLineGap,
        setIndentLineGap,
        relativeFontSize,
        setRelativeFontSize,
        theme,
        setTheme,
      }}
    >
      {children}
    </TocContext.Provider>
  );
}
