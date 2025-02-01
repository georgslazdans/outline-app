"use client";

import { Dictionary } from "@/app/dictionaries";
import { Context } from "@/context/DetailsContext";
import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import Svg from "@/lib/svg/Svg";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import Dxf from "@/lib/dxf/Dxf";

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
      Svg.download(context.contours, paperDimensions);
    }
  };

  const exportDxf = () => {
    if (hasExportableContours) {
      const paperDimensions = paperDimensionsOfDetailsContext(context);
      Dxf.download(context.contours, paperDimensions);
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
        <label>{dictionary.contours.export}</label>
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
              <label>{dictionary.contours.svg}</label>
            </Button>
            <Button
              onClick={exportDxf}
              className="px-4 py-2"
              style="secondary"
              size="medium"
            >
              <label>{dictionary.contours.dxf}</label>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportDropdown;
