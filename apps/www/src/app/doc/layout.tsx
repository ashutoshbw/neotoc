"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TocProvider } from "@/components/toc/toc-provider";
import { Button } from "@/components/ui/button";
import { SidebarOpenIcon, SidebarCloseIcon } from "lucide-react";

export default function DocLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [tocVisibility, setTocVisibility] = useState(false);

  function handleArticleClick(e: React.MouseEvent<HTMLElement>) {
    const elt = e.target as HTMLElement;
    let parent = elt.parentElement;
    while (parent) {
      if (parent.tagName === "ARTICLE") break;
      if (parent.dataset.ntController !== undefined) return;
      parent = parent.parentElement;
    }

    if (tocVisibility) {
      setTocVisibility(false);
    }
  }

  return (
    <div className="flex justify-center mb-8">
      <article
        className="max-w-[67ch] mt-8 md:px-8 mx-4 overflow-auto"
        onClick={handleArticleClick}
      >
        <TocProvider>{children}</TocProvider>
      </article>
      <aside
        className={cn(
          "md:min-h-80 md:block md:static md:border-none transition-all duration-300 fixed border-l border-b rounded-bl-lg overflow-hidden md:overflow-visible md:shadow-none shadow-lg shadow-zinc-950/10 dark:shadow-zinc-950 w-[280px] flex-shrink-0 [&>*:first-child]:sticky [&>*:first-child]:top-[calc(var(--site-header-height)+var(--top-breathing-space))]",
          tocVisibility ? "right-0" : "right-[-300px]"
        )}
        id="sidebar"
      ></aside>
      <Button
        className="md:hidden fixed bottom-4 right-4 [&_svg]:size-6 [&_svg]:stroke-1"
        variant="secondary"
        size="icon"
        onClick={() => {
          setTocVisibility(!tocVisibility);
        }}
      >
        {tocVisibility ? <SidebarOpenIcon /> : <SidebarCloseIcon />}
      </Button>
    </div>
  );
}
