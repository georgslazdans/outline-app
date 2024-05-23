import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Outline App",
  description: "Create SVG paths from images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  );
}
