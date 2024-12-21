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
    <div>
      <header className="border-b sticky top-0 z-50 bg-background/60 backdrop-blur">
        <div className="p-2 flex">
          <ThemeToggler />
          <Button
            className="md:hidden"
            onClick={() => {
              setTocVisibility(!tocVisibility);
            }}
          >
            Toc
          </Button>
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
            "md:block md:sticky md:border-none transition-all duration-300 fixed border-l pl-2 bg-background w-[280px] flex-shrink-0 [&>*:first-child]:sticky [&>*:first-child]:top-0",
            tocVisibility ? "right-0" : "right-[-300px]"
          )}
          id="sidebar"
        ></aside>
      </div>
    </div>
  );
}
