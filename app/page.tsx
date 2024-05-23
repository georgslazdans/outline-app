import Image from "next/image";
import { getDictionary } from "./dictionaries";
import ImageUpload from "@/components/ImageUpload";
import wrenchPic from './wrench.png'

export default async function Home() {
  const dictionary = await getDictionary("en");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1>{dictionary.description}</h1>
        <Image
          src={wrenchPic}
          alt={dictionary.pictureAlt}
          priority
        ></Image>
        <ImageUpload id="picture">{dictionary.addPicture}</ImageUpload>
      </div>
    </main>
  );
}
