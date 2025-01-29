import { getDictionary } from "../dictionaries";
import Calibration from "@/components/calibration/Calibration";

export default async function CalibrationPage() {
  const dictionary = await getDictionary("en");

  return (
    <>
      <Calibration dictionary={dictionary}></Calibration>
    </>
  );
}
