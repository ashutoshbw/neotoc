"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeToggler = () => {
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <div>
      <Button variant="ghost" size="icon" onClick={toggleTheme}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
};
