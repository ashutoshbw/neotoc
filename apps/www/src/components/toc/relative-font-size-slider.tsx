"use client";
import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Slider } from "@/components/ui/slider";

export function RelativeFontSizeSlider({ min = 90 }: { min?: number }) {
  const tc = useContext(TocContext);

  return (
    tc && (
      <div className="flex gap-2 flex-wrap" data-nt-controller>
        <span className="flex-shrink-0">
          <code>--relative-font-size</code>:
        </span>
        <span className="flex gap-2">
          <Slider
            className="w-[80px] cursor-pointer"
            value={[tc.relativeFontSize]}
            max={100}
            min={min}
            step={0.1}
            onValueChange={([v]) => {
              tc.setRelativeFontSize(v);
            }}
          />
          <span>{tc.relativeFontSize}</span>
        </span>
      </div>
    )
  );
}
