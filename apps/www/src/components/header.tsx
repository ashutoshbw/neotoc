import { ThemeToggler } from "@/components/theme-toggler";
import Link from "next/link";
import LogoSmall from "./logo-small";

export function Header() {
  return (
    <header
      className={`h-[3.5rem] flex flex-col border-b sticky top-0 z-50 bg-background/80 backdrop-blur`}
    >
      <div className="mx-auto max-w-screen-xl w-full px-4 flex items-center gap-2 flex-grow shrink-0">
        <Link href="/">
          <LogoSmall className="w-[35px]" />
        </Link>
        <span>
          <span className="text-sm opacity-80 tracking-tight">v0.2.3</span>
        </span>
        <span className="ml-auto flex items-center gap-2">
          <ThemeToggler />
          <Link href="https://github.com/ashutoshbw/neotoc" target="_blank">
            <GithubIcon />
            <span className="sr-only">Github</span>
          </Link>
        </span>
      </div>
    </header>
  );
}

function GithubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.7em"
      height="1.7em"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
      ></path>
    </svg>
  );
}
