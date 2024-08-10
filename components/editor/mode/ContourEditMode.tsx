"use client";

import { Dictionary } from "@/app/dictionaries";
import { ModelData } from "@/lib/replicad/Work";
import React, { useState } from "react";
import SvgMesh from "../svg/SvgMesh";
import { ContourPoints } from "@/lib/Point";

type Props = {
  dictionary: Dictionary;
  onContourChange: (data: ModelData) => void;
  setDisableCamera: (disabled: boolean) => void;
};

const ContourEditMode = ({ dictionary, onContourChange, setDisableCamera }: Props) => {
  const [selectedContour, setSelectedContour] = useState<ContourPoints[]>();


  return (
    <>
         {selectedContour && (
            <SvgMesh
              contoursPoints={selectedContour}
              onPointMoveStart={() => setDisableCamera(true)}
              onPointMoveEnd={() => setDisableCamera(false)}
            ></SvgMesh>
          )}
    </>
  );
};

export default ContourEditMode;
