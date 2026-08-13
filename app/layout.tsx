import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/inter";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import {
  ClerkProvider
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "ChitChat",
  description: "Let's Have a ChitChat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        GeistSans.variable,
        GeistMono.variable,
        "font-sans"
      )}
      style={{ "--font-sans": "'Inter Variable', sans-serif" } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
