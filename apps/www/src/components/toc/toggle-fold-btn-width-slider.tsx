"use client";
import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Slider } from "@/components/ui/slider";
import { codeClassName } from "@/mdx-components";

export function ToggleFoldBtnWidthSlider() {
  const tc = useContext(TocContext);

  return (
    tc && (
      <div className="flex gap-2 flex-wrap" data-nt-controller>
        <span className="flex-shrink-0">
          <code className={codeClassName}>--toggle-fold-btn-width</code>:
        </span>
        <span className="flex gap-2 grow">
          <Slider
            className="min-w-[40px] grow cursor-pointer"
            value={[tc.toggleFoldBtnWidth]}
            max={2}
            min={0.6}
            step={0.1}
            onValueChange={([v]) => {
              tc.setToggleFoldBtnWidth(v);
            }}
          />
          <span className="shrink-0 w-[4em]">{tc.toggleFoldBtnWidth}em</span>
        </span>
      </div>
    )
  );
}
