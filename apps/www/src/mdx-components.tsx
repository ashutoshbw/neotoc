import type { MDXComponents } from "mdx/types";
import { Heading } from "@/components/headings";
import { Code } from "@/components/code/code";

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
      <Heading as="h2" className="text-3xl first:mt-0 mt-12" {...props} />
    ),
    h3: (props) => <Heading as="h3" className="text-2xl mt-8" {...props} />,
    h4: (props) => <Heading as="h4" className="text-xl mt-8" {...props} />,
    h5: (props) => <Heading as="h5" className="text-lg mt-8" {...props} />,
    h6: (props) => <Heading as="h6" className="text-base mt-8" {...props} />,
    p: (props) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
    ),
    ul: (props) => (
      <ul className="my-4 ml-6 list-disc [&>li]:mt-2 [&_ul]:my-0" {...props} />
    ),
    ol: (props) => (
      <ul
        className="my-4 ml-6 list-decimal [&>li]:mt-2 [&_ul]:my-0"
        {...props}
      />
    ),
    a: (props) => (
      <a
        className="text-blue-600 dark:text-blue-400 hover:underline"
        {...props}
      />
    ),
    Code,
    code: (props) => (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
        {...props}
      />
    ),
    ...components,
  };
}
