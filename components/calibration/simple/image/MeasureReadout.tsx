"use client";

import { Dictionary } from "@/app/dictionaries";

type Props = {
  dictionary: Dictionary;
  measurement?: string;
  hint?: string;
};

/**
 * Presentational chip for the measuring tool, rendered by `MeasureOverlay`
 * on top of the image. The translucent background keeps it legible over any
 * photo; `pointer-events-none` lets clicks and drags reach the overlay below.
 */
const MeasureReadout = ({ dictionary, measurement, hint }: Props) => {
  if (!measurement && !hint) {
    return null;
  }
  return (
    <p
      data-testid="measure-readout"
      className="pointer-events-none rounded-md bg-white/85 px-3 py-1.5 text-sm font-medium text-neutral-900 shadow dark:bg-neutral-900/85 dark:text-neutral-100"
    >
      {measurement
        ? `${dictionary.calibration.measure.distance}: ${measurement}`
        : hint}
    </p>
  );
};

export default MeasureReadout;
