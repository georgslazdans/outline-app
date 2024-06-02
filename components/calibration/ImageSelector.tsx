"use client";

import { Dictionary } from "@/app/dictionaries";
import StepResult from "@/lib/opencv/StepResult";
import { ChangeEvent, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const name = "calibration-image-selector";

  const changeIndex = (index: number) => {
    onDataChange(stepResults[index]);
    setCurrentIndex(index);
  };

  const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const index = Number.parseInt(event.target.value);
    changeIndex(index);
  };

  const handleLeft = () => {
    if (currentIndex <= 0) {
      return;
    }
    changeIndex(currentIndex - 1);
  };

  const handleRight = () => {
    if (currentIndex >= stepResults.length - 1) {
      return;
    }
    changeIndex(currentIndex + 1);
  };

  return (
    <div className="flex flex-row items-center">
      {/* TODO add custom chevron to select */}

      <ArrowLeftIcon
        className="size-6 m-2"
        onClick={handleLeft}
      ></ArrowLeftIcon>
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
      <ArrowRightIcon
        className="size-6 m-2"
        onClick={handleRight}
      ></ArrowRightIcon>
    </div>
  );
};
