import { type HighlightedCode, Pre, Inline } from "codehike/code";
import "./github-from-css.css";

export function Code({ codeblock }: { codeblock: HighlightedCode }) {
  return (
    <Pre
      className="p-2 rounded border [--ch-16:#f4f4f5] dark:[--ch-16:#18181b]"
      code={codeblock}
      style={codeblock.style}
    />
  );
}

export function InlineCode({ codeblock }: { codeblock: HighlightedCode }) {
  return (
    <Inline
      className="px-1 py-[2px] rounded [--ch-16:#e4e4e7] dark:[--ch-16:#18181b]"
      code={codeblock}
      style={codeblock.style}
    />
  );
}
