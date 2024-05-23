import Image from "next/image";
import { getDictionary } from "./dictionaries";
import ImageUpload from "@/components/ImageUpload";
import wrenchPic from "./wrench.png";
import PhotoUpload from "@/components/PhotoUpload";

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
        <PhotoUpload className="mt-4 xl:hidden" id="capture">{dictionary.capturePhoto}</PhotoUpload>
        <ImageUpload className="mt-4" id="upload">{dictionary.uploadPicture}</ImageUpload>
        <h2 className="mt-6 text-center">{dictionary.learnMore}</h2>
      </div>
    </main>
  );
}
