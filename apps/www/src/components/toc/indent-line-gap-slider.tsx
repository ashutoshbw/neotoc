import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Slider } from "@/components/ui/slider";

export function IndentLineGapSlider() {
  const tc = useContext(TocContext);

  return (
    tc && (
      <div className="flex gap-2 flex-wrap" data-nt-controller>
        <span className="flex-shrink-0">
          <code>--indent-line-gap</code>:
        </span>
        <span className="flex gap-2">
          <Slider
            className="w-[80px] cursor-pointer"
            value={[tc.indentLineGap]}
            max={20}
            min={0}
            step={0.1}
            onValueChange={([v]) => {
              tc.setIndentLineGap(v);
            }}
          />
          <span>{tc.indentLineGap}px</span>
        </span>
      </div>
    )
  );
}
