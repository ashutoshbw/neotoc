"use client";

import { TocProvider } from "@/components/toc/toc-provider";
import Doc from "./doc.mdx";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center">
        <article className="w-[67ch] m-8">
          <TocProvider>
            <Doc />
          </TocProvider>
        </article>
        <aside
          className="md:block hidden relative w-[280px] flex-shrink-0 pl-4 [&>*:first-child]:sticky [&>*:first-child]:top-0"
          id="sidebar"
        ></aside>
      </div>
    </div>
  );
}
