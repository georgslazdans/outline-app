import type { Metadata } from "next";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";
import { getDictionary } from "./dictionaries";
import dynamic from "next/dynamic";

const IndexedDbContext = dynamic(() => import("@/context/IndexedDbContext"), {
  ssr: false,
});
const DetailsProvider = dynamic(() => import("@/context/DetailsContext"), {
  ssr: false,
});

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
