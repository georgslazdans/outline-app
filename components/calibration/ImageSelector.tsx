"use client";

import { Dictionary } from "@/app/dictionaries";
import StepResult from "@/lib/opencv/StepResult";
import { ChangeEvent } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid'

type Props = {
  dictionary: Dictionary;
  stepResults: StepResult[];
  onDataChange: (data: StepResult) => void;
};

export const ImageSelector = ({
  dictionary,
  stepResults,
  onDataChange,
}: Props) => {
  const name = "calibration-image-selector";

  const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const index = Number.parseInt(event.target.value);
    onDataChange(stepResults[index]);
  };

  return (
    <div className="flex flex-row items-center">
      {/* TODO add custom chevron to select */}

      <ArrowLeftIcon className="size-6"></ArrowLeftIcon>
      <select
        className="flex-grow text-center border-4 rounded-[64px] bg-white dark:bg-black border-black dark:border-white p-1.5 py-2 pl-6"
        id={name}
        name={name}
        onChange={(event) => handleOnChange(event)}
      >
        {stepResults.map((result, index) => (
          <option key={index} value={index}>
            {dictionary.calibration.step[result.stepName]}
          </option>
        ))}
      </select>
      <ArrowRightIcon className="size-6"></ArrowRightIcon>
    </div>
  );
};
