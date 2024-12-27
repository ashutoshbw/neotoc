import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkSmartypants from "remark-smartypants";
import rehypeSlug from "rehype-slug";
import { remarkCodeHike, recmaCodeHike, CodeHikeConfig } from "codehike/mdx";

const chConfig: CodeHikeConfig = {
  components: { code: "Code", inlineCode: "InlineCode" },
  syntaxHighlighting: {
    theme: "github-from-css",
  },
};

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkSmartypants, [remarkCodeHike, chConfig]],
    recmaPlugins: [[recmaCodeHike, chConfig]],
    rehypePlugins: [rehypeSlug],
    jsx: true,
  },
});

export default withMDX(nextConfig);
