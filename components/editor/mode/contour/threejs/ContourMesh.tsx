import React, { memo, useCallback, useEffect, useState } from "react";
import ContourPoint from "./ContourPoint";
import { Matrix4, Vector3 } from "three";
import ContourLines from "./ContourLines";
import ContourIndex from "../../../../../lib/data/contour/ContourIndex";
import ContourPoints, {
  modifyContour,
  queryContour,
} from "@/lib/data/contour/ContourPoints";
import Draggable from "./Draggable";
import Point from "@/lib/data/Point";
import { useFrame, useThree } from "@react-three/fiber";
import useDebounced from "@/lib/utils/Debounced";

type Props = {
  contourIndex: number;
  contour: ContourPoints;
  onContourChange: (contour: ContourPoints) => void;
  selectedPoint?: ContourIndex;
  transparent: boolean;
};

const ContourMesh = memo(function ContourMeshFun({
  contourIndex,
  contour,
  onContourChange,
  selectedPoint,
  transparent,
}: Props) {
  const { camera } = useThree();
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [pointSize, setPointSize] = useState(1);

  useEffect(() => {
    setCurrentPoints(contour.points);
  }, [contour]);

  const { onChange: setPointSizeDebounced } = useDebounced(setPointSize, 200);

  const cameraScaleFunction = (x: number) => {
    const maxValue = 10;
    const minValue = 0.4;
    // const result = 4.4 - 0.9 * Math.log(x) + 0.1;
    const result = 9.5 - 1.2 * Math.log(x);
    return Math.max(Math.min(result, maxValue), minValue);
  };

  useFrame((state, delta, xrFrame) => {
    const size = cameraScaleFunction(camera.zoom);
    if (size != pointSize) {
      setPointSizeDebounced(size);
    }
  });

  const onPointDrag = (pointIndex: number) => {
    return (l: Matrix4, _dl: Matrix4, w: Matrix4, dw: Matrix4) => {
      const pos = new Vector3();
      pos.setFromMatrixPosition(w);

      const delta = new Vector3();
      delta.setFromMatrixPosition(dw);

      const updatedPoints = [...currentPoints];
      updatedPoints[pointIndex] = { x: pos.x + delta.x, y: pos.y + delta.y };
      setCurrentPoints(updatedPoints);
      onContourChange({ points: updatedPoints });
    };
  };

  const isPointSelected = useCallback(
    (pointIndex: number) => {
      return (
        selectedPoint?.contour == contourIndex &&
        selectedPoint?.point == pointIndex
      );
    },
    [contourIndex, selectedPoint]
  );

  const addPointToContour = (point: Point) => {
    const segment = queryContour(contour).findLineSegmentClosestToPoint(point);
    const { addPoint } = modifyContour(contour);
    onContourChange(addPoint(point, segment.indexB));
  };

  return (
    <group>
      {currentPoints?.length > 0 && (
        <>
          {currentPoints.map((point, index) => {
            return (
              <Draggable
                key={index}
                enabled={isPointSelected(index)}
                position={new Vector3(point.x, point.y, 0)}
                onPointDrag={onPointDrag(index)}
              >
                <ContourPoint
                  contourIndex={contourIndex}
                  index={index}
                  color={isPointSelected(index) ? "#DA4167" : "#2c7d94"} //"#0D0D0E"}
                  transparent={transparent}
                  size={pointSize}
                />
              </Draggable>
            );
          })}
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
