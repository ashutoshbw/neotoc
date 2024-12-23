"use client";

import { ThemeToggler } from "@/components/theme-toggler";
import { TocProvider } from "@/components/toc/toc-provider";
import Doc from "./doc.mdx";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [tocVisibility, setTocVisibility] = useState(false);
  return (
    <div className="[--site-header-height:3.25rem] md:[--top-breathing-space:3rem] md:[--bottom-breathing-space:3rem] [--top-breathing-space:0rem] [--bottom-breathing-space:25vh]">
      <header className="h-[var(--site-header-height)] border-b sticky top-0 z-50 bg-background/60 backdrop-blur">
        <div className="px-2 flex items-center justify-between h-full">
          <Button
            className="md:hidden"
            onClick={() => {
              setTocVisibility(!tocVisibility);
            }}
          >
            Toc
          </Button>
          <ThemeToggler />
        </div>
      </header>
      <div className="flex justify-center">
        <article className="w-[67ch] m-8">
          <TocProvider>
            <Doc />
          </TocProvider>
        </article>
        <aside
          className={cn(
            "md:block md:static md:border-none transition-all duration-300 fixed border-l border-b rounded-bl-lg overflow-hidden md:overflow-visible md:shadow-none shadow-lg shadow-zinc-950/10 dark:shadow-zinc-950 bg-background w-[280px] flex-shrink-0 [&>*:first-child]:sticky [&>*:first-child]:top-[calc(var(--site-header-height)+var(--top-breathing-space))]",
            tocVisibility ? "right-0" : "right-[-300px]"
          )}
          id="sidebar"
        ></aside>
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut consectetur
        laudantium eligendi repudiandae iure. Quasi debitis soluta esse. Harum
        ab cupiditate temporibus odit perspiciatis ratione nemo voluptatem neque
        nostrum nobis.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut consectetur
        laudantium eligendi repudiandae iure. Quasi debitis soluta esse. Harum
        ab cupiditate temporibus odit perspiciatis ratione nemo voluptatem neque
        nostrum nobis.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut consectetur
        laudantium eligendi repudiandae iure. Quasi debitis soluta esse. Harum
        ab cupiditate temporibus odit perspiciatis ratione nemo voluptatem neque
        nostrum nobis.
      </p>
    </div>
  );
}
