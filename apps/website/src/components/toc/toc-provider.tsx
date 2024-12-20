"use client";
import { useState, useEffect } from "react";
import neotoc from "neotoc";
import { TocContext } from "./toc-context";
import "./neotoc.css";

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [toc, setToc] = useState<HTMLDivElement | null>(null);
  const [autoFold, setAutoFold] = useState(false);
  const [relativeFontSize, setRelativeFontSize] = useState(94);
  const [indentLineGap, setIndentLineGap] = useState(5);

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
  }, [toc, relativeFontSize, indentLineGap]);

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
      }}
    >
      {children}
    </TocContext.Provider>
  );
}
