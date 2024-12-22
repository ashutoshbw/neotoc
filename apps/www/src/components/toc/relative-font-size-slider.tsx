import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Slider } from "@/components/ui/slider";

export function RelativeFontSizeSlider() {
  const tc = useContext(TocContext);

  return (
    tc && (
      <div className="flex gap-2">
        <span className="flex-shrink-0">
          <code>--relative-font-size</code>:
        </span>
        <Slider
          className="w-[80px] flex-shrink-0 cursor-pointer"
          value={[tc.relativeFontSize]}
          max={100}
          min={90}
          step={0.1}
          onValueChange={([v]) => {
            tc.setRelativeFontSize(v);
          }}
        />
        <span>{tc.relativeFontSize}</span>
      </div>
    )
  );
}
