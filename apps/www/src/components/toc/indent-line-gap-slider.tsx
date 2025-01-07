"use client";
import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Slider } from "@/components/ui/slider";
import { codeClassName } from "@/mdx-components";

export function IndentLineGapSlider({ max = 20 }: { max?: number }) {
  const tc = useContext(TocContext);

  return (
    tc && (
      <div className="flex gap-2 flex-wrap" data-nt-controller>
        <span className="flex-shrink-0">
          <code className={codeClassName}>--indent-line-gap</code>:
        </span>
        <span className="flex gap-2 grow">
          <Slider
            className="min-w-[40px] grow cursor-pointer"
            value={[tc.indentLineGap]}
            max={max}
            min={0}
            step={0.1}
            onValueChange={([v]) => {
              tc.setIndentLineGap(v);
            }}
          />
          <span className="shrink-0 w-[4em]">{tc.indentLineGap}px</span>
        </span>
      </div>
    )
  );
}
