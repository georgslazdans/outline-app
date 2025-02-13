import { POINT_SCALE_THREEJS } from "@/lib/data/Point";
import GridfinityParams from "@/lib/replicad/model/item/gridfinity/GridfinityParams";
import SplitCut, {
  forSplitCut,
} from "@/lib/replicad/model/item/gridfinity/SplitCut";
import { toRadians } from "@/lib/utils/Math";
import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  BufferGeometry,
  DoubleSide,
  EdgesGeometry,
  PlaneGeometry,
} from "three";

const planeOf = (splitCut: SplitCut, params: GridfinityParams) => {
  const { gridSize, height, xSize, ySize } = params;

  const totalXSize = gridSize * xSize;
  const totalYSize = gridSize * ySize;

  const totalHeight = 2 * height * 7 + 7;

  if (forSplitCut(splitCut).isVertical()) {
    const planeYSize = (splitCut.end.y - splitCut.start.y) * gridSize;
    const xPosition = gridSize * splitCut.start.x;
    const yPosition = gridSize * splitCut.start.y;
    return new PlaneGeometry(planeYSize, totalHeight * 2)
      .rotateX(toRadians(90))
      .rotateZ(toRadians(90))
      .translate(
        -totalXSize / 2,
        -totalYSize / 2 + planeYSize / 2,
        totalHeight / 2
      )
      .translate(xPosition, yPosition, 0);
  } else {
    const planeXSize = (splitCut.end.x - splitCut.start.x) * gridSize;
    const xPosition = gridSize * splitCut.start.x;
    const yPosition = gridSize * splitCut.start.y;
    return new PlaneGeometry(planeXSize, totalHeight * 2)
      .rotateX(toRadians(90))
      .translate(
        -totalXSize / 2 + planeXSize / 2,
        -totalYSize / 2,
        totalHeight / 2
      )
      .translate(xPosition, yPosition, 0);
  }
};

type Props = {
  opacity: number;
  selected?: boolean;
  color: string;
  splitCut: SplitCut;
  gridfinityParams: GridfinityParams;
};
const ThreejsPlane = ({
  color,
  opacity,
  selected,
  splitCut,
  gridfinityParams,
}: Props) => {
  const { invalidate } = useThree();
  const [isReady, setIsReady] = useState(false);
  const body = useRef<BufferGeometry>();
  const lines = useRef<BufferGeometry>();

  useEffect(() => {
    setIsReady(false);
  }, [gridfinityParams, splitCut]);

  const plane = useMemo(() => {
    const planeGeometry = planeOf(splitCut, gridfinityParams);
    return { geometry: planeGeometry, edges: new EdgesGeometry(planeGeometry) };
  }, [gridfinityParams, splitCut]);

  useLayoutEffect(() => {
    const { geometry, edges } = plane;
    body.current = geometry;
    lines.current = edges;

    setIsReady(true);
  }, [plane]);

  useEffect(() => {
    if (isReady) {
      requestAnimationFrame(() => invalidate());
    }
  }, [invalidate, isReady]);
  const outlineColor = selected ? "#DA4167" : "#1296b6";

  return (
    <group
      scale={[POINT_SCALE_THREEJS, POINT_SCALE_THREEJS, POINT_SCALE_THREEJS]}
    >
      {body.current && (
        <>
          <mesh geometry={body.current}>
            <meshStandardMaterial
              color={color}
              polygonOffset
              polygonOffsetFactor={2.0}
              polygonOffsetUnits={1.0}
              opacity={opacity}
              side={DoubleSide}
            />
          </mesh>
          <lineSegments geometry={lines.current}>
            <lineBasicMaterial color={outlineColor} />
          </lineSegments>
        </>
      )}
    </group>
  );
};

export default ThreejsPlane;
