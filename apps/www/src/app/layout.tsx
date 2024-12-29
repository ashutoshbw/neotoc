import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggler } from "@/components/theme-toggler";
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
          <div className="[--site-header-height:3.25rem] md:[--top-breathing-space:2rem] md:[--bottom-breathing-space:3rem] [--top-breathing-space:0px] [--bottom-breathing-space:40vh] flex flex-col min-h-[100dvh]">
            <header className="h-[var(--site-header-height)] border-b sticky top-0 z-50 bg-background/60 backdrop-blur">
              <div className="px-2 flex items-center justify-between h-full">
                <ThemeToggler />
              </div>
            </header>
            <main>{children}</main>
            <footer className="mt-auto py-2 border-t grid place-items-center">
              Made by Ashutosh Biswas
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
