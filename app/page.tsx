import { getDictionary } from "./dictionaries";
import wrenchPic from "./wrench_with_outline.png";
import Upload from "@/components/image/Upload";
import ExportedImage from "next-image-export-optimizer";

export default async function Home() {
  const dictionary = await getDictionary("en");
  return (
    <main className="flex min-h-full flex-col items-center justify-between p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between mt-2">
        <h1 className="text-center p-2 mt-12 xl:mt-2">{dictionary.description}</h1>
        <div className="relative h-[47vh] mt-4">
          <div className="absolute h-full w-full">
            <ExportedImage
              className="object-contain"
              src={wrenchPic}
              alt={dictionary.pictureAlt}
              priority
              fill
            ></ExportedImage>
          </div>
        </div>
        <Upload dictionary={dictionary}></Upload>
        <p className="mt-6 text-center">{dictionary.learnMore}</p>
      </div>
    </main>
  );
}
