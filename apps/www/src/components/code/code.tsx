import { type HighlightedCode, Pre } from "codehike/code";
import "./github-from-css.css";

export function Code({ codeblock }: { codeblock: HighlightedCode }) {
  return (
    <Pre
      className="my-4 p-2 rounded [--ch-16:#f4f4f5] dark:[--ch-16:hsla(240deg_5.9%_10%/0.8)] overflow-auto"
      code={codeblock}
      style={codeblock.style}
    />
  );
}
