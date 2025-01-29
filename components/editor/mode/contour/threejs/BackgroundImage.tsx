import { Context } from "@/context/DetailsContext";
import React, { memo, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { Image } from "@react-three/drei";
import { Vector3 } from "three";
import {
  PaperDimensions,
  paperDimensionsOf,
  paperSettingsOf,
} from "@/lib/opencv/PaperSettings";
import { useEditorContext } from "@/components/editor/EditorContext";

type Props = {
  detailsContextId: number;
};

const BackgroundImage = memo(function BackgroundImage({
  detailsContextId,
}: Props) {
  const { wireframe } = useEditorContext();
  const { getByID } = useIndexedDB("details");
  const [imageUrl, setImageUrl] = useState<string>();
  const [paperDimensions, setPaperDimensions] = useState<PaperDimensions>();

  useEffect(() => {
    getByID(detailsContextId).then((context) => {
      const detailsContext = context as Context;
      if (detailsContext.paperImage) {
        const paperSettings = paperSettingsOf(detailsContext.settings);
        setPaperDimensions(paperDimensionsOf(paperSettings));
        setImageUrl(URL.createObjectURL(detailsContext.paperImage));
      }
    });
  }, [detailsContextId, getByID]);

  const calculateScale = (): [number, number] => {
    if (paperDimensions) {
      const baseLength = 100;
      const xScale = paperDimensions.width / baseLength;
      const yScale = paperDimensions.height / baseLength;
      return [xScale, yScale];
    }
    return [1, 1];
  };

  return (
    <>
      {imageUrl && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          visible={!wireframe}
          scale={calculateScale()}
          position={new Vector3(0, 0, -0.01)}
          url={imageUrl}
        />
      )}
    </>
  );
});

export default BackgroundImage;
