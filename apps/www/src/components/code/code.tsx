import { type HighlightedCode, Pre } from "codehike/code";
import "./github-from-css.css";

export function Code({ codeblock }: { codeblock: HighlightedCode }) {
  return (
    <Pre
      className="my-4 p-2 rounded border [--ch-16:#f4f4f5] dark:[--ch-16:#18181b]"
      code={codeblock}
      style={codeblock.style}
    />
  );
}
