import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Learn Neotoc—A tool for easily generating beautiful table of contents with JavaScript.",
  description:
    "Neotoc is a tool for easily generating beautiful table of contents with JavaScript. Explore an interactive demo of it and learn how to use it in your webpage.",
};

export default function DocLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
