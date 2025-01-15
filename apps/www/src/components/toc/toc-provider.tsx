"use client";
import { useState, useEffect } from "react";
import neotoc from "neotoc";
import { TocContext } from "./toc-context";
import "./neotoc.css";

export const defaultValues = {
  relativeFontSize: 94,
  indentLineGap: 5,
  indentLineWidth: 1,
  toggleFoldBtnWidth: 0.9,
  anchorPaddingBlock: 0.2,
  anchorPaddingInline: 0.3,
  anchorBorderRadius: 4,
  paddingLeft: 1.5,
  lightBarWidth: 1,
  lightBarTipRadius: 2.5,
  lightSpreadLength: 250,
  foldingDuration: 0.3,
};

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    const mediaQueryList = window.matchMedia("(min-width: 768px)");

    setIsDesktop(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", handleResize);

    return () => {
      mediaQueryList.removeEventListener("change", handleResize);
    };
  }, []);

  const [toc, setToc] = useState<HTMLDivElement | null>(null);
  const [autoFold, setAutoFold] = useState(false);
  const [ellipsis, setEllipsis] = useState(false);
  const [relativeFontSize, setRelativeFontSize] = useState(
    defaultValues.relativeFontSize
  );
  const [indentLineGap, setIndentLineGap] = useState(
    defaultValues.indentLineGap
  );
  const [toggleFoldBtnWidth, setToggleFoldBtnWidth] = useState(
    defaultValues.toggleFoldBtnWidth
  );
  const [indentLineWidth, setIndentLineWidth] = useState(
    defaultValues.indentLineWidth
  );
  const [anchorPaddingBlock, setAnchorPaddingBlock] = useState(
    defaultValues.anchorPaddingBlock
  );
  const [anchorPaddingInline, setAnchorPaddingInline] = useState(
    defaultValues.anchorPaddingInline
  );
  const [anchorBorderRadius, setAnchorBorderRadius] = useState(
    defaultValues.anchorBorderRadius
  );
  const [paddingLeft, setPaddingLeft] = useState(defaultValues.paddingLeft);
  const [lightBarWidth, setLightBarWidth] = useState(
    defaultValues.lightBarWidth
  );
  const [lightBarTipRadius, setLightBarTipRadius] = useState(
    defaultValues.lightBarTipRadius
  );
  const [lightSpreadLength, setLightSpreadLength] = useState(
    defaultValues.lightSpreadLength
  );
  const [foldingDuration, setFoldingDuration] = useState(
    defaultValues.foldingDuration
  );

  useEffect(() => {
    const breadcrumbDesktopDiv = document.querySelector("#nt-breadcrumb");
    const breadcrumbMobileDiv = document.querySelector("#nt-breadcrumb-mobile");
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
      onBreadcrumbChange(data) {
        const breadcrumbDiv = isDesktop
          ? breadcrumbDesktopDiv
          : breadcrumbMobileDiv;
        if (breadcrumbDiv) {
          breadcrumbDiv.innerHTML = "";

          data.forEach((item, i) => {
            const anchor = document.createElement("a");
            anchor.append(item.content);
            anchor.href = item.hash;
            if (i != 0) {
              const sep = document.createElement("span");
              sep.className = "px-1";
              sep.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m10 17l5-5l-5-5"/></svg>`;
              breadcrumbDiv.append(sep);
            }
            breadcrumbDiv.append(anchor);
          });
        }
      },
      offsetTop: isDesktop ? 80 : 96,
    });
    const tocWidget = document.querySelector<HTMLDivElement>(
      "#sidebar .nt-widget"
    );
    setToc(tocWidget);
    return removeToc;
  }, [isDesktop, autoFold, ellipsis]);

  useEffect(() => {
    toc?.style.setProperty("--relative-font-size", `${relativeFontSize}`);
  }, [toc, relativeFontSize]);

  useEffect(() => {
    toc?.style.setProperty("--indent-line-gap", `${indentLineGap}px`);
  }, [toc, indentLineGap]);

  useEffect(() => {
    toc?.style.setProperty(
      "--toggle-fold-btn-width",
      `${toggleFoldBtnWidth}em`
    );
  }, [toc, toggleFoldBtnWidth]);

  useEffect(() => {
    toc?.style.setProperty("--indent-line-width", `${indentLineWidth}px`);
  }, [toc, indentLineWidth]);

  useEffect(() => {
    toc?.style.setProperty("--anchor-padding-block", `${anchorPaddingBlock}em`);
  }, [toc, anchorPaddingBlock]);

  useEffect(() => {
    toc?.style.setProperty(
      "--anchor-padding-inline",
      `${anchorPaddingInline}em`
    );
  }, [toc, anchorPaddingInline]);

  useEffect(() => {
    toc?.style.setProperty("--anchor-border-radius", `${anchorBorderRadius}px`);
  }, [toc, anchorBorderRadius]);

  useEffect(() => {
    toc?.style.setProperty("--padding-left", `${paddingLeft}rem`);
  }, [toc, paddingLeft]);

  useEffect(() => {
    toc?.style.setProperty("--light-bar-width", `${lightBarWidth}px`);
  }, [toc, lightBarWidth]);

  useEffect(() => {
    toc?.style.setProperty("--light-bar-tip-radius", `${lightBarTipRadius}px`);
  }, [toc, lightBarTipRadius]);

  useEffect(() => {
    toc?.style.setProperty("--light-spread-length", `${lightSpreadLength}px`);
  }, [toc, lightSpreadLength]);

  useEffect(() => {
    toc?.style.setProperty("--folding-duration", `${foldingDuration}s`);
  }, [toc, foldingDuration]);

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
