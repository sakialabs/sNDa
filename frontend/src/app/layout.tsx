import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sNDa App",
  description: "Wrapping Support Around Every Life",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Document, providers, and lang/dir are handled in app/[locale]/layout.tsx
  return <>{children}</>;
}
