"use client";
import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarOpenIcon, SidebarCloseIcon } from "lucide-react";
import DocsMDXContent from "./docs.mdx";
import neotoc from "neotoc";
import "neotoc/base-modern.css";
import "neotoc/colors-zinc.css";
import "./neotoc.css";

export default function DocsPage() {
  const [tocVisibility, setTocVisibility] = useState(false);

  // Prevent unnecessary re-renders
  const memoizedMDXContent = useMemo(() => {
    return <DocsMDXContent />;
  }, []);

  useEffect(() => {
    const breadcrumbDiv =
      document.querySelector<HTMLDivElement>("#nt-breadcrumb");

    let isDragging = false;
    let startX: number;
    let scrollLeft: number;

    const startDragging = (e: MouseEvent | TouchEvent) => {
      if (breadcrumbDiv) {
        const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
        isDragging = true;
        startX = pageX - breadcrumbDiv.offsetLeft;
        scrollLeft = breadcrumbDiv.scrollLeft;
      }
    };

    const stopDragging = () => {
      isDragging = false;
    };

    const onDrag = (e: MouseEvent | TouchEvent) => {
      if (breadcrumbDiv) {
        if (!isDragging) return;
        const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
        const x = pageX - breadcrumbDiv.offsetLeft;
        const walk = x - startX;
        breadcrumbDiv.scrollLeft = scrollLeft - walk;
      }
    };

    breadcrumbDiv?.addEventListener("mousedown", startDragging);
    breadcrumbDiv?.addEventListener("touchstart", startDragging, {
      passive: true,
    });
    breadcrumbDiv?.addEventListener("mouseup", stopDragging);
    breadcrumbDiv?.addEventListener("touchend", stopDragging, {
      passive: true,
    });
    breadcrumbDiv?.addEventListener("mousemove", onDrag);
    breadcrumbDiv?.addEventListener("touchmove", onDrag, { passive: true });

    const removeToc = neotoc({
      io: "article >> :not(.admonition :is(h2,h3,h4,h5,h6)):is(h2,h3,h4,h5,h6) >> #sidebar",
      ellipsis: true,
      fillAnchor(h) {
        const a = h.firstChild;
        const span = document.createElement("span");
        span.append(
          ...[...a!.childNodes].slice(1, -1).map((n) => n.cloneNode(true)),
        );
        return span;
      },
      onBreadcrumbChange(data) {
        if (breadcrumbDiv) {
          breadcrumbDiv.innerHTML = "";

          data.forEach((item, i) => {
            const anchor = document.createElement("a");
            anchor.append(item.content);
            anchor.href = item.hash;
            anchor.className = "md:hover:underline";
            if (i != 0) {
              const sep = document.createElement("span");
              sep.className = "px-1";
              sep.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m10 17l5-5l-5-5"/></svg>`;
              breadcrumbDiv.append(sep);
            }
            breadcrumbDiv.append(anchor);
          });
        }
      },
      offsetTop: 112,
    });

    return () => {
      removeToc();
      if (breadcrumbDiv) breadcrumbDiv.innerHTML = "";
      breadcrumbDiv?.removeEventListener("mousedown", startDragging);
      breadcrumbDiv?.removeEventListener("touchstart", startDragging);
      breadcrumbDiv?.removeEventListener("mouseup", stopDragging);
      breadcrumbDiv?.removeEventListener("touchend", stopDragging);
      breadcrumbDiv?.removeEventListener("mousemove", onDrag);
      breadcrumbDiv?.removeEventListener("touchmove", onDrag);
    };
  }, []);

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
    <div className="grid md:grid-cols-[1fr_minmax(0,596px)_280px_1fr] grid-cols-1 mb-8">
      <article
        onClick={handleArticleClick}
        className="md:col-start-2 md:[font-size:0.98rem] mt-8 md:px-8 px-4"
      >
        {memoizedMDXContent}
      </article>
      <aside
        className={cn(
          "md:[font-size:0.92rem] md:min-h-80 md:block md:static fixed md:border-none transition-all duration-300 border-l border-b rounded-bl-lg overflow-hidden md:overflow-visible md:shadow-none shadow-lg shadow-zinc-950/10 dark:shadow-zinc-950 w-[280px] flex-shrink-0 [&>*:first-child]:sticky [&>*:first-child]:top-[calc(var(--site-header-height)+var(--top-breathing-space))]",
          tocVisibility ? "right-0" : "right-[-300px]",
        )}
        id="sidebar"
      ></aside>
      <Button
        className="md:hidden fixed bottom-4 right-4 [&_svg]:size-6 bg-gradient-to-r from-zinc-500 to-zinc-400 shadow-xl shadow-zinc-500/50"
        size="icon"
        onClick={() => {
          setTocVisibility((x) => !x);
        }}
      >
        {tocVisibility ? <SidebarOpenIcon /> : <SidebarCloseIcon />}
        <span className="sr-only">Show or hide table of contents sidebar</span>
      </Button>
    </div>
  );
}
