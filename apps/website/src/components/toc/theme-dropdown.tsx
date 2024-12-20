"use client";

import { useContext } from "react";
import { TocContext } from "./toc-context";

export default function ThemeDropdown() {
  const tc = useContext(TocContext);

  return (
    <div className="p-5 border bg-zinc-100 dark:bg-zinc-900">
      Choose a theme for Toc:{" "}
      <select
        name=""
        id=""
        value={tc?.theme}
        onChange={(e) => {
          tc?.setTheme(e.target.value);
        }}
      >
        <option value="default">Default</option>
        <option value="zinc-light">Zinc Light</option>
        <option value="zinc-dark">Zinc Dark</option>
        <option value="parchment-light">Parchment Light</option>
        <option value="parchment-dark">Parchment Dark</option>
      </select>
    </div>
  );
}
