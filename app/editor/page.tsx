import Editor from "@/components/editor/Editor";
import { getDictionary } from "../dictionaries";

export default async function Details() {
  const dictionary = await getDictionary("en");

  return (
    <>
      <h1 className="text-center p-2">{dictionary.editor.title}</h1>
      <div className="w-full h-[70vh]">
        <Editor dictionary={dictionary}></Editor>
      </div>
    </>
  );
}
