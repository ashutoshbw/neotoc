import { type HighlightedCode, Pre, Inline } from "codehike/code";
import "./github-from-css.css";

export function Code({ codeblock }: { codeblock: HighlightedCode }) {
  return <Pre code={codeblock} style={codeblock.style} />;
}

export function InlineCode({ codeblock }: { codeblock: HighlightedCode }) {
  return <Inline code={codeblock} style={codeblock.style} />;
}
