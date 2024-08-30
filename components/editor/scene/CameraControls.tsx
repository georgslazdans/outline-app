import { OrbitControls } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import { useEditorContext } from "../EditorContext";
import EditorMode from "../mode/EditorMode";
import { Euler, Vector3 } from "three";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type Props = {};

type Transform = {
  position: Vector3;
  rotation: Euler;
};

const CameraControls = ({}: Props) => {
  const controlRef = useRef<OrbitControlsImpl>(null);
  const {
    editorMode,
    disableCamera,
    transformEditFocused,
    setTransformEditFocused,
  } = useEditorContext();
  const { camera } = useThree();

  const [canRotate, setCanRotate] = useState<boolean>(true);
  const [previousMode, setPreviousMode] = useState<EditorMode>(EditorMode.EDIT);
  const [previousTransform, setPreviousTransform] = useState<Transform>({
    position: new Vector3(),
    rotation: new Euler(),
  });

  const setDefaultContourModeCamera = (): void => {
    if (controlRef.current) {
      controlRef.current.reset();
    }
    camera.position.set(0, 0, 1);
    camera.rotation.set(0, 0, 0);
  };

  const setCameraFromTransform = (transform: Transform) => {
    if (controlRef.current) {
      controlRef.current.reset();
    }
    const { position, rotation } = transform;
    camera.position.set(position.x, position.y, position.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);
  };

  useEffect(() => {
    if (editorMode != previousMode) {
      if (previousMode == EditorMode.CONTOUR_EDIT) {
        setCanRotate(true);
        setCameraFromTransform(previousTransform);
      }
      if (editorMode == EditorMode.CONTOUR_EDIT) {
        setPreviousTransform({
          position: camera.position.clone(),
          rotation: camera.rotation.clone(),
        });
        setCanRotate(false);
        setDefaultContourModeCamera();
      }
      setPreviousMode(editorMode);
    }
  }, [editorMode]);

  const onDrag = () => {
    if (!transformEditFocused) {
      setTransformEditFocused(true);
    }
  };

  const onDragEnd = () => {
    setTimeout(() => {
      setTransformEditFocused(false);
    });
  };

  return (
    <>
      <OrbitControls
        ref={controlRef}
        makeDefault
        rotateSpeed={0.5}
        panSpeed={0.75}
        enableDamping={false}
        enableRotate={canRotate}
        enabled={!disableCamera}
        onChange={onDrag}
        onEnd={onDragEnd}
      />
    </>
  );
};

export default CameraControls;
