import type { Metadata } from "next";
import "./globals.css";
import { DetailsProvider } from "@/context/DetailsContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { getDictionary } from "./dictionaries";
import IndexedDbContext from "@/context/IndexedDbContext";
import { initDB } from "react-indexed-db-hook";
import { DBConfig } from "@/lib/DbConfig";



export const metadata: Metadata = {
  title: "Outline App",
  description: "Create SVG paths from images",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dictionary = await getDictionary("en");

  return (
    <html lang="en">
      <body>
        <IndexedDbContext></IndexedDbContext>
        <LoadingProvider dictionary={dictionary}>
          <DetailsProvider>{children}</DetailsProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
