import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggler } from "@/components/theme-toggler";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neotoc",
  description: "Documentation site of Neotoc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="[--site-header-height:3.85rem] md:[--top-breathing-space:2rem] md:[--bottom-breathing-space:3rem] [--top-breathing-space:0px] [--bottom-breathing-space:40vh] flex flex-col min-h-[100dvh]">
            <header className="h-[var(--site-header-height)] border-b sticky top-0 z-50 bg-background/60 backdrop-blur">
              <div className="mx-4 flex items-center justify-between h-full">
                <Link href="/">
                  <b>Neotoc v0.1.3</b>
                </Link>
                <span className="flex items-center gap-2">
                  <ThemeToggler />
                  <Link
                    href="https://github.com/ashutoshbw/neotoc"
                    target="_blank"
                  >
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
                  </Link>
                </span>
              </div>
            </header>
            <main>{children}</main>
            <footer className="mt-auto py-2 border-t grid place-items-center">
              Built with passion
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
