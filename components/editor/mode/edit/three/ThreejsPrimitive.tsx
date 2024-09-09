import { POINT_SCALE_THREEJS } from "@/lib/data/Point";
import Item from "@/lib/replicad/model/Item";
import Primitive from "@/lib/replicad/model/item/Primitive";
import {
  BoxParams,
  CapsuleParams,
  CylinderParams,
  SphereParams,
} from "@/lib/replicad/model/item/PrimitiveParams";
import PrimitiveType from "@/lib/replicad/model/item/PrimitiveType";
import { toRadians } from "@/lib/utils/Math";
import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  EdgesGeometry,
  SphereGeometry,
} from "three";

const boxOf = (params: BoxParams) => {
  return new BoxGeometry(params.width, params.height, params.length)
    .rotateX(toRadians(90))
    .translate(0, 0, params.height / 2);
};

const sphereOf = (params: SphereParams) => {
  const widthSegments = 10;
  const heightSegments = 10;
  return new SphereGeometry(params.radius, widthSegments, heightSegments);
};

const cylinderOf = (params: CylinderParams) => {
  const radiusTop = params.radius;
  const radiusBottom = params.radius;
  const height = params.height;
  const radialSegments = 15;
  return new CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)
    .rotateX(toRadians(90))
    .translate(0, 0, height / 2);
};

const capsuleOf = (params: CapsuleParams) => {
  const radius = params.radius;
  const length = params.middleHeight;
  const capSegments = 4;
  const radialSegments = 8;
  return new CapsuleGeometry(radius, length, capSegments, radialSegments)
    .rotateX(toRadians(90))
    .translate(0, 0, length / 2);
};

const threeJsGeometryOf = (
  item: Item & Primitive
): BufferGeometry | undefined => {
  switch (item.params.type) {
    case PrimitiveType.BOX:
      return boxOf(item.params);
    case PrimitiveType.SPHERE:
      return sphereOf(item.params);
    case PrimitiveType.CYLINDER:
      return cylinderOf(item.params);
    case PrimitiveType.CAPSULE:
      return capsuleOf(item.params);
  }
};

type Props = {
  item: Item & Primitive;
  opacity: number;
  wireframe: boolean;

  selected?: boolean;
  color: string;
};
const ThreejsPrimitive = function ThreejsPrimitive({
  item,
  color,
  opacity,
  selected,
  wireframe,
}: Props) {
  const { invalidate } = useThree();
  const body = useRef<BufferGeometry>();
  const lines = useRef<BufferGeometry>();

  useLayoutEffect(() => {
    const faces = threeJsGeometryOf(item)!;
    console.log(body.current);
    body.current = faces;
    lines.current = new EdgesGeometry(faces);

    invalidate();
  }, [invalidate, item]);

  const outlineColor = selected ? "#DA4167" : "#1296b6";

  return (
    <group
      scale={[POINT_SCALE_THREEJS, POINT_SCALE_THREEJS, POINT_SCALE_THREEJS]}
      userData={{ id: item.id }}
    >
      {body.current && (
        <>
          {!wireframe && (
            <mesh geometry={body.current} userData={{ id: item.id }}>
              <meshStandardMaterial
                color={color}
                polygonOffset
                polygonOffsetFactor={2.0}
                polygonOffsetUnits={1.0}
                transparent={opacity >= 1 ? false : true}
                opacity={opacity}
              />
            </mesh>
          )}
          <lineSegments geometry={lines.current} userData={{ id: item.id }}>
            <lineBasicMaterial color={outlineColor} />
          </lineSegments>
        </>
      )}
    </group>
  );
};

export default ThreejsPrimitive;
