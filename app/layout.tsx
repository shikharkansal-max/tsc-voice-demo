import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TSC Voice | Tractor Supply Company Voice Agent Demo",
  description: "Experience AI-powered voice agents for Tractor Supply Company",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white">{children}</body>
    </html>
  );
}
