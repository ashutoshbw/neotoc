import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkSmartypants from "remark-smartypants";
import rehypeSlug from "rehype-slug";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkSmartypants],
    rehypePlugins: [rehypeSlug],
  },
});

export default withMDX(nextConfig);
