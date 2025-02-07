import type { Metadata } from "next";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";
import { getDictionary } from "./dictionaries";
import dynamic from "next/dynamic";
import Navbar from "@/components/navbar/Navbar";
import { ErrorProvider } from "@/components/error/ErrorContext";

const IndexedDbContext = dynamic(() => import("@/db/IndexedDbContext"), {
  ssr: false,
});
const DetailsProvider = dynamic(() => import("@/context/DetailsContext"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Outline App",
  description: "Create SVG paths from images",
  manifest: "/manifest.json",
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
        <Navbar dictionary={dictionary} />
        <main className="flex min-h-full flex-col items-center justify-between p-4">
          <div className="z-10 w-full max-w-5xl items-center justify-between">
            <LoadingProvider dictionary={dictionary}>
              <IndexedDbContext></IndexedDbContext>

              <ErrorProvider dictionary={dictionary}>
                <DetailsProvider>{children}</DetailsProvider>
              </ErrorProvider>
            </LoadingProvider>
          </div>
        </main>
      </body>
    </html>
  );
}
