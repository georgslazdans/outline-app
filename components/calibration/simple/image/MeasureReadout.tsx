"use client";

import { Dictionary } from "@/app/dictionaries";

type Props = {
  dictionary: Dictionary;
  hint?: string;
  measurement?: string;
};

const MeasureReadout = ({ dictionary, hint, measurement }: Props) => {
  if (!hint && !measurement) {
    return null;
  }
  return (
    <p
      data-testid="measure-readout"
      className="select-text rounded-md bg-white/85 px-3 py-1.5 text-sm font-medium text-neutral-900 shadow dark:bg-neutral-900/85 dark:text-neutral-100"
    >
      {hint && !measurement && <span>{hint}</span>}
      {measurement && (
        <span className="font-semibold tabular-nums">
          {dictionary.calibration.measure.distance}: {measurement}
        </span>
      )}
    </p>
  );
};

export default MeasureReadout;
