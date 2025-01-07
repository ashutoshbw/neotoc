"use client";
import { useState, useEffect } from "react";
import neotoc from "neotoc";
import { TocContext } from "./toc-context";
import "./neotoc.css";

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [toc, setToc] = useState<HTMLDivElement | null>(null);
  const [autoFold, setAutoFold] = useState(false);
  const [ellipsis, setEllipsis] = useState(false);
  const [relativeFontSize, setRelativeFontSize] = useState(94);
  const [indentLineGap, setIndentLineGap] = useState(5);
  const [toggleFoldBtnWidth, setToggleFoldBtnWidth] = useState(0.9);
  const [indentLineWidth, setIndentLineWidth] = useState(1);
  const [anchorPaddingBlock, setAnchorPaddingBlock] = useState(0.2);
  const [anchorPaddingInline, setAnchorPaddingInline] = useState(0.3);
  const [anchorBorderRadius, setAnchorBorderRadius] = useState(4);
  const [paddingLeft, setPaddingLeft] = useState(1.5);
  const [lightBarWidth, setLightBarWidth] = useState(1);
  const [lightBarTipRadius, setLightBarTipRadius] = useState(2.5);
  const [lightSpreadLength, setLightSpreadLength] = useState(250);
  const [foldingDuration, setFoldingDuration] = useState(0.3);

  useEffect(() => {
    const removeToc = neotoc({
      io: "article >> h2,h3,h4,h5,h6 >> #sidebar",
      autoFold: autoFold,
      ellipsis: ellipsis,
      fillAnchor(h) {
        const a = h.firstChild;
        const span = document.createElement("span");
        span.append(
          ...[...a!.childNodes].slice(1, -1).map((n) => n.cloneNode(true))
        );
        return span;
      },
      offsetTop: 80,
    });
    const tocWidget = document.querySelector<HTMLDivElement>(
      "#sidebar .nt-widget"
    );
    setToc(tocWidget);
    return removeToc;
  }, [autoFold, ellipsis]);

  useEffect(() => {
    toc?.style.setProperty("--relative-font-size", `${relativeFontSize}`);
    toc?.style.setProperty("--indent-line-gap", `${indentLineGap}px`);
    toc?.style.setProperty(
      "--toggle-fold-btn-width",
      `${toggleFoldBtnWidth}em`
    );
    toc?.style.setProperty("--indent-line-width", `${indentLineWidth}px`);
    toc?.style.setProperty("--anchor-padding-block", `${anchorPaddingBlock}em`);
    toc?.style.setProperty(
      "--anchor-padding-inline",
      `${anchorPaddingInline}em`
    );
    toc?.style.setProperty("--anchor-border-radius", `${anchorBorderRadius}px`);
    toc?.style.setProperty("--padding-left", `${paddingLeft}rem`);
    toc?.style.setProperty("--light-bar-width", `${lightBarWidth}px`);
    toc?.style.setProperty("--light-bar-tip-radius", `${lightBarTipRadius}px`);
    toc?.style.setProperty("--light-bar-tip-radius", `${lightBarTipRadius}px`);
    toc?.style.setProperty("--light-spread-length", `${lightSpreadLength}px`);
    toc?.style.setProperty("--folding-duration", `${foldingDuration}s`);
  }, [
    toc,
    relativeFontSize,
    indentLineGap,
    toggleFoldBtnWidth,
    indentLineWidth,
    anchorPaddingBlock,
    anchorPaddingInline,
    anchorBorderRadius,
    paddingLeft,
    lightBarWidth,
    lightBarTipRadius,
    lightSpreadLength,
    foldingDuration,
  ]);

  return (
    <TocContext.Provider
      value={{
        toc,
        autoFold,
        ellipsis,
        setEllipsis,
        setAutoFold,
        indentLineGap,
        setIndentLineGap,
        relativeFontSize,
        setRelativeFontSize,
        toggleFoldBtnWidth,
        setToggleFoldBtnWidth,
        indentLineWidth,
        setIndentLineWidth,
        anchorPaddingBlock,
        setAnchorPaddingBlock,
        anchorPaddingInline,
        setAnchorPaddingInline,
        anchorBorderRadius,
        setAnchorBorderRadius,
        paddingLeft,
        setPaddingLeft,
        lightBarWidth,
        setLightBarWidth,
        lightBarTipRadius,
        setLightBarTipRadius,
        lightSpreadLength,
        setLightSpreadLength,
        foldingDuration,
        setFoldingDuration,
      }}
    >
      {children}
    </TocContext.Provider>
  );
}
