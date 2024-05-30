"use client";

import { IntermediateData } from "@/lib/opencv/ImageProcessor";
import { ChangeEvent, ChangeEventHandler } from "react";

type Props = {
  imageData: IntermediateData[];
  onDataChange: (data: IntermediateData) => void;
};

export const ImageSelector = ({ imageData, onDataChange }: Props) => {
  const label = "Image selector";
  const name = "test-image-selector";

  const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const index = Number.parseInt(event.target.value);
    onDataChange(imageData[index]);
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="ml-4" htmlFor={name}>
          {label}
        </label>
      )}
      {/* TODO add custom chevron to select */}
      <select
        className="border-4 rounded-[64px] bg-white dark:bg-black border-black dark:border-white p-1.5 py-2 pl-6"
        id={name}
        name={name}
        onChange={(event) => handleOnChange(event)}
      >
        {imageData.map((option, index) => (
          <option key={index} value={index}>
            {option.stepName}
          </option>
        ))}
      </select>
    </div>
  );
};
