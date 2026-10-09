"use client";

import { Dictionary } from "@/app/dictionaries";

type Props = {
  dictionary: Dictionary;
  hint?: string;
};

/**
 * Presentational hint chip for the measuring tool. It is rendered by
 * `OutlineImageViewer` outside the transformed content, so — unlike the markers
 * on the image — it stays put and clickable while the image pans and zooms
 * beneath it. The translucent background keeps it legible over any photo.
 */
const MeasureReadout = ({ hint }: Props) => {
  if (!hint) {
    return null;
  }
  return (
    <p
      data-testid="measure-readout"
      className="select-text rounded-md bg-white/85 px-3 py-1.5 text-sm font-medium text-neutral-900 shadow dark:bg-neutral-900/85 dark:text-neutral-100"
    >
      {hint}
    </p>
  );
};

export default MeasureReadout;
