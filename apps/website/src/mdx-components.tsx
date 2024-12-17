import type { MDXComponents } from "mdx/types";
import { Heading } from "@/components/headings";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <Heading
        as="h1"
        className="text-4xl font-extrabold lg:text-5xl"
        {...props}
      />
    ),
    h2: (props) => (
      <Heading
        as="h2"
        className="text-3xl font-semibold first:mt-0"
        {...props}
      />
    ),
    h3: (props) => (
      <Heading as="h3" className="text-2xl font-semibold" {...props} />
    ),
    h4: (props) => (
      <Heading as="h4" className="text-xl font-semibold" {...props} />
    ),
    h5: (props) => (
      <Heading as="h5" className="text-lg font-semibold" {...props} />
    ),
    h6: (props) => (
      <Heading as="h6" className="text-base font-semibold" {...props} />
    ),
    ...components,
  };
}
