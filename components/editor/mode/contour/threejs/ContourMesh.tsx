import React, { memo, useEffect, useState } from "react";
import ContourLines from "./ContourLines";
import Point from "@/lib/data/Point";
import { useFrame, useThree } from "@react-three/fiber";
import useDebounced from "@/lib/utils/Debounced";
import { nextIndex } from "@/lib/data/line/PointIndex";
import ContourPoints, { modifyContour } from "@/lib/data/contour/ContourPoints";
import ContourPointsInstances from "./ContourPointsInstances";

type Props = {
  contourIndex: number;
  contour: ContourPoints;
  onContourChange: (contour: ContourPoints, flush?: boolean) => void;
  transparent: boolean;
  onModelEditEnd?: () => void;
};

const ContourMesh = memo(function ContourMeshFun({
  contourIndex,
  contour,
  onContourChange,
}: Props) {
  const { camera, invalidate } = useThree();
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [pointSize, setPointSize] = useState(1);

  useEffect(() => {
    setCurrentPoints(contour.points);
  }, [contour]);

  const { onChange: setPointSizeDebounced } = useDebounced(setPointSize, 200);

  const cameraScaleFunction = (x: number) => {
    return Math.min(1600 / x, 5);
  };

  useFrame((state, delta, xrFrame) => {
    const size = cameraScaleFunction(camera.zoom);
    if (size != pointSize) {
      setPointSizeDebounced(size);
    }
  });

  const onPointDrag = (point: Point, pointIndex: number) => {
    const updatedPoints = [...currentPoints];
    updatedPoints[pointIndex] = point;
    setCurrentPoints(updatedPoints);
    onContourChange({ points: updatedPoints });
  };

  const addPointToContour = (point: Point, index: number) => {
    const { addPoint } = modifyContour(contour);
    onContourChange(
      addPoint(point, nextIndex(index, currentPoints.length)),
      true
    );
  };

  return (
    <group>
      {currentPoints?.length > 0 && (
        <>
          <ContourPointsInstances
            points={currentPoints}
            contourIndex={contourIndex}
            onPointDrag={onPointDrag}
            pointSize={pointSize}
          ></ContourPointsInstances>
          <ContourLines
            points={currentPoints}
            onLineDoubleClick={addPointToContour}
          ></ContourLines>
        </>
      )}
    </group>
  );
});

export default ContourMesh;
