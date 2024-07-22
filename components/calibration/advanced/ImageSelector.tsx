"use client";

import { Dictionary } from "@/app/dictionaries";
import StepResult from "@/lib/opencv/StepResult";
import { ChangeEvent, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import IconButton from "@/components/IconButton";

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
      <IconButton onClick={handleLeft} className="mr-1">
        <ArrowLeftIcon className="size-6 m-2"></ArrowLeftIcon>
      </IconButton>
      <select
        className="flex-grow text-center border-4 rounded-[64px] bg-white dark:bg-black border-black dark:border-white p-1.5 py-2 pl-6 font-bold"
        id={name}
        name={name}
        onChange={(event) => handleOnChange(event)}
        value={currentIndex}
      >
        {stepResults.map((result, index) => (
          <option key={index} value={index}>
            {dictionary.calibration.step[result.stepName]}
          </option>
        ))}
      </select>
      <IconButton onClick={handleRight} className="ml-1">
        <ArrowRightIcon className="size-6 m-2"></ArrowRightIcon>
      </IconButton>
    </div>
  );
};
