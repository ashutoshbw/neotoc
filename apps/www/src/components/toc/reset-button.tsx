"use client";
import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Button } from "@/components/ui/button";
import { defaultValues } from "./toc-provider";

export function ResetButton() {
  const tc = useContext(TocContext);

  const resetToDefaults = () => {
    if (tc) {
      tc.setRelativeFontSize(defaultValues.relativeFontSize);
      tc.setToggleFoldBtnWidth(defaultValues.toggleFoldBtnWidth);
      tc.setIndentLineGap(defaultValues.indentLineGap);
      tc.setIndentLineWidth(defaultValues.indentLineWidth);
      tc.setAnchorPaddingBlock(defaultValues.anchorPaddingBlock);
      tc.setAnchorPaddingInline(defaultValues.anchorPaddingInline);
      tc.setAnchorBorderRadius(defaultValues.anchorBorderRadius);
      tc.setPaddingLeft(defaultValues.paddingLeft);
      tc.setLightBarWidth(defaultValues.lightBarWidth);
      tc.setLightBarTipRadius(defaultValues.lightBarTipRadius);
      tc.setLightSpreadLength(defaultValues.lightSpreadLength);
      tc.setFoldingDuration(defaultValues.foldingDuration);
      const tocBody = tc.toc?.querySelector(".nt-body");
      if (tocBody) tocBody.scrollTop = 0;
    }
  };

  return (
    tc && (
      <span data-nt-controller className="relative top-[2px]">
        <Button onClick={resetToDefaults}>Reset to default values</Button>
      </span>
    )
  );
}
