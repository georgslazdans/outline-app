import Image from "next/image";
import { getDictionary } from "./dictionaries";
import wrenchPic from "./wrench.png";
import Upload from "@/components/image/Upload";

export default async function Home() {
  const dictionary = await getDictionary("en");

  return (
    <main className="flex min-h-full flex-col items-center justify-between p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between mt-2">
        <h1 className="text-center p-2">{dictionary.description}</h1>
        <div className="relative h-[50vh] mt-4">
          <div className="absolute h-full w-full">
            <Image
              className="object-contain"
              src={wrenchPic}
              alt={dictionary.pictureAlt}
              priority
              fill
            ></Image>
          </div>
        </div>
        <Upload dictionary={dictionary}></Upload>
        <h2 className="mt-6 text-center">{dictionary.learnMore}</h2>
      </div>
    </main>
  );
}
