import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
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
          <div className="[--site-header-height:5.5rem] md:[--top-breathing-space:2rem] md:[--bottom-breathing-space:3rem] [--top-breathing-space:0px] [--bottom-breathing-space:40vh] flex flex-col min-h-[100dvh]">
            <Header />
            <main>{children}</main>
            <footer className="mt-auto text-center py-4 text-sm border-t">
              <p>Released under the MIT License.</p>
              <p>
                Built by{" "}
                <Link
                  className="hover:underline"
                  target="_blank"
                  href="https://x.com/ashutoshbw"
                >
                  Ashutosh Biswas
                </Link>
                .
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
