"use client";
import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Slider } from "@/components/ui/slider";
import { codeClassName } from "@/mdx-components";

export function PaddingLeftSlider() {
  const tc = useContext(TocContext);

  return (
    tc && (
      <div className="flex gap-2 flex-wrap" data-nt-controller>
        <span className="flex-shrink-0">
          <code className={codeClassName}>--padding-left</code>:
        </span>
        <span className="flex gap-2 grow">
          <Slider
            className="min-w-[40px] grow cursor-pointer"
            value={[tc.paddingLeft]}
            max={8}
            min={0}
            step={0.1}
            onValueChange={([v]) => {
              tc.setPaddingLeft(v);
            }}
          />
          <span className="shrink-0 w-[4em]">{tc.paddingLeft}px</span>
        </span>
      </div>
    )
  );
}
