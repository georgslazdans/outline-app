import { Sphere } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React, { useRef } from "react";
import { Vector3 } from "three";

type Props = {
  position: Vector3;
  onDrag: (newPosition: Vector3) => void;
};

const SvgPoint = ({ position, onDrag }: Props) => {
  const pointRef = useRef<any>();

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    event.target.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (event.target.hasPointerCapture(event.pointerId)) {
      const { x, y } = event.intersections[0].point;
      console.log("New Position", x, y);
      pointRef.current!.position.set(x, y, 0);
      onDrag(new Vector3(x, y, 0));
    }
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    event.target.releasePointerCapture(event.pointerId);
  };

  return (
    <Sphere
      position={position}
      ref={pointRef}
    //   onPointerDown={handlePointerDown}
    //   onPointerMove={handlePointerMove}
    //   onPointerUp={handlePointerUp}
    >
      <meshBasicMaterial color="red" />
    </Sphere>
    // <mesh
    //   ref={pointRef}
    //   position={position}
    //   onPointerDown={handlePointerDown}
    //   onPointerMove={handlePointerMove}
    //   onPointerUp={handlePointerUp}
    // >
    //   <sphereGeometry args={[0.1, 16, 16]} />
    //   <meshBasicMaterial color="red" />
    // </mesh>
  );
};

export default SvgPoint;
