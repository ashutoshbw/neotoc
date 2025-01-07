"use client";
import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Slider } from "@/components/ui/slider";
import { codeClassName } from "@/mdx-components";

export function LightBarTipRadiusSlider() {
  const tc = useContext(TocContext);

  return (
    tc && (
      <div className="flex gap-2 flex-wrap" data-nt-controller>
        <span className="flex-shrink-0">
          <code className={codeClassName}>--light-bar-tip-radius</code>:
        </span>
        <span className="flex gap-2 grow">
          <Slider
            className="min-w-[40px] grow cursor-pointer"
            value={[tc.lightBarTipRadius]}
            max={10}
            min={0}
            step={1}
            onValueChange={([v]) => {
              tc.setLightBarTipRadius(v);
            }}
          />
          <span className="shrink-0 w-[4em]">{tc.lightBarTipRadius}px</span>
        </span>
      </div>
    )
  );
}
