import Editor from "@/components/editor/Editor";
import { getDictionary } from "../dictionaries";

export default async function Details() {
  const dictionary = await getDictionary("en");

  return (
    <>
      <Editor dictionary={dictionary}></Editor>
    </>
  );
}
