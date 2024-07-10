import OpenCvCalibration from "@/components/calibration/OpenCvCalibration";
import { getDictionary } from "../dictionaries";

export default async function Calibration() {
  const dictionary = await getDictionary("en");

  return (
    <main className="flex min-h-full flex-col items-center justify-between p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between mt-2">
        <h1 className="text-center p-2 mb-2">{dictionary.calibration.title}</h1>
        <OpenCvCalibration dictionary={dictionary}></OpenCvCalibration>
      </div>
    </main>
  );
}
