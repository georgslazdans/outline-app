"use client";

import { Dictionary } from "@/app/dictionaries";
import { Context } from "@/context/DetailsContext";
import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import Dxf from "@/lib/vector/dxf/Dxf";
import exportNameOf from "@/lib/utils/ExportName";
import Svg from "@/lib/vector/svg/Svg";

type Props = {
  context: Context;
  dictionary: Dictionary;
};

const ExportDropdown = ({ context, dictionary }: Props) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const hasExportableContours =
    !!context.contours && context.contours.length != 0;

  const exportSvg = () => {
    if (hasExportableContours) {
      const paperDimensions = paperDimensionsOfDetailsContext(context);
      const exportName = exportNameOf(context.details.name);
      Svg.download(context.contours, paperDimensions, exportName);
    }
  };

  const exportDxf = () => {
    if (hasExportableContours) {
      const paperDimensions = paperDimensionsOfDetailsContext(context);
      const exportName = exportNameOf(context.details.name);
      Dxf.download(context.contours, paperDimensions, exportName);
    }
  };

  const toggleDropdown = () => {
    if (hasExportableContours) {
      setIsOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const buttonClass = "h-16 p-0";
  return (
    <>
      <Button
        onClick={toggleDropdown}
        className={buttonClass}
        style={hasExportableContours ? "secondary" : "disabled"}
      >
        <label className="cursor-pointer">{dictionary.contours.export}</label>
      </Button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-72 ml-[0.5rem] mt-[-5.5rem]
                     origin-top-right bg-white border border-gray-300
                     rounded-md shadow-lg"
        >
          <div className="mx-auto py-4 pl-5 pr-0 flex flex-row gap-2">
            <label className="my-auto">File Type</label>
            <Button
              onClick={exportSvg}
              className="px-4 py-2"
              style="secondary"
              size="medium"
            >
              <label className="cursor-pointer">
                {dictionary.contours.svg}
              </label>
            </Button>
            <Button
              onClick={exportDxf}
              className="px-4 py-2"
              style="secondary"
              size="medium"
            >
              <label className="cursor-pointer">
                {dictionary.contours.dxf}
              </label>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportDropdown;
