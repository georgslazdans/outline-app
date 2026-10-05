"use client";

import { Dictionary } from "@/app/dictionaries";

type Props = {
  dictionary: Dictionary;
  measurement?: string;
  hint?: string;
};

const MeasureReadout = ({ dictionary, measurement, hint }: Props) => {
  if (!measurement && !hint) {
    return null;
  }
  return (
    <p
      data-testid="measure-readout"
      className="mt-2 select-text text-center text-sm text-neutral-700 dark:text-neutral-200"
    >
      {measurement
        ? `${dictionary.calibration.measure.distance}: ${measurement}`
        : hint}
    </p>
  );
};

export default MeasureReadout;
