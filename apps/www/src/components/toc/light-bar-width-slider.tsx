"use client";
import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Slider } from "@/components/ui/slider";
import { codeClassName } from "@/mdx-components";

export function LightBarWidthSlider() {
  const tc = useContext(TocContext);

  return (
    tc && (
      <div className="flex gap-2 flex-wrap" data-nt-controller>
        <span className="flex-shrink-0">
          <code className={codeClassName}>--light-bar-width</code>:
        </span>
        <span className="flex gap-2 grow">
          <Slider
            className="min-w-[40px] grow cursor-pointer"
            value={[tc.lightBarWidth]}
            max={5}
            min={0}
            step={1}
            onValueChange={([v]) => {
              tc.setLightBarWidth(v);
            }}
          />
          <span className="shrink-0 w-[4em]">{tc.lightBarWidth}px</span>
        </span>
      </div>
    )
  );
}
