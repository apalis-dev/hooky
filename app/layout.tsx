import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Hooky - Reliable Webhook Delivery without the Complexity",
  description: "Hooky is the solution between expensive enterprise tools and unreliable DIY webhook systems. 5-minute setup, 99% delivery rate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}