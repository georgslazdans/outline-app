import OpenCvCalibration from "@/components/calibration/OpenCvCalibration";
import { getDictionary } from "../dictionaries";

export default async function Calibration() {
  const dictionary = await getDictionary("en");

  return (
    <>
      <h1 className="text-center p-2 mb-2 mt-2">
        {dictionary.calibration.title}
      </h1>
      <OpenCvCalibration dictionary={dictionary}></OpenCvCalibration>
    </>
  );
}
