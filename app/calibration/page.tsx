import { getDictionary } from "../dictionaries";
import Calibration from "@/components/calibration/Calibration";

export default async function CalibrationPage() {
  const dictionary = await getDictionary("en");

  return (
    <>
      <h1 className="text-center p-2 mb-2 mt-2">
        {dictionary.calibration.title}
      </h1>
      <Calibration dictionary={dictionary}></Calibration>
    </>
  );
}
