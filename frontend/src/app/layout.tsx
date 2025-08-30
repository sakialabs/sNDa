import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sNDa",
  description: "🥪 a Sandwich of Support 🥪",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Wrap with required html/body per Next.js App Router
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
