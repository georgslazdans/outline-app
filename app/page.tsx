import { getDictionary } from "./dictionaries";
import wrenchPic from "./wrench_with_outline.png";
import Upload from "@/components/image/Upload";
import ExportedImage from "next-image-export-optimizer";

export default async function Home() {
  const dictionary = await getDictionary("en");
  return (
    <>
      <h1 className="text-center p-2 mt-14 xl:mt-4">
        {dictionary.description}
      </h1>
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
      <p className="mt-6 text-center">
        <a href="/instructions#quick-start">{dictionary.learnMore}</a>
      </p>
    </>
  );
}
