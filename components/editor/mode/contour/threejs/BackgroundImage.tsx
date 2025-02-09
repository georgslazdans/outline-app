import { Context } from "@/context/DetailsContext";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { Image } from "@react-three/drei";
import { Vector3 } from "three";
import {
  PaperDimensions,
  paperDimensionsOf,
  paperSettingsOf,
} from "@/lib/opencv/PaperSettings";
import { useEditorContext } from "@/components/editor/EditorContext";
import SavedFile from "@/lib/SavedFile";
import Point from "@/lib/data/Point";

type Props = {
  detailsContextId: number;
  offset?: Point;
};

const BackgroundImage = memo(function BackgroundImage({
  detailsContextId,
  offset,
}: Props) {
  const { wireframe } = useEditorContext();
  const { getByID } = useIndexedDB("details");
  const { getByID: getImageBlobById } = useIndexedDB("files");
  const [imageUrl, setImageUrl] = useState<string>();
  const [paperDimensions, setPaperDimensions] = useState<PaperDimensions>();

  useEffect(() => {
    getByID(detailsContextId).then((context: Context) => {
      const detailsContext = context;
      if (detailsContext.paperImage) {
        getImageBlobById(detailsContext.paperImage).then((it: SavedFile) => {
          const paperSettings = paperSettingsOf(detailsContext.settings);
          setPaperDimensions(paperDimensionsOf(paperSettings));
          setImageUrl(URL.createObjectURL(it.blob));
        });
      }
    });
  }, [detailsContextId, getByID, getImageBlobById]);

  const calculateScale = (): [number, number] => {
    if (paperDimensions) {
      const baseLength = 100;
      const xScale = paperDimensions.width / baseLength;
      const yScale = paperDimensions.height / baseLength;
      return [xScale, yScale];
    }
    return [1, 1];
  };

  const position = () => {
    if (offset) {
      const [xScale, yScale] = calculateScale();
      return new Vector3(offset.x / 100, offset.y / 100, -0.01);
    } else {
      return new Vector3(0, 0, -0.01);
    }
  };
  console.log(
    "Image URL",
    imageUrl,
    "Position",
    position(),
    "scale",
    calculateScale()
  );
  return (
    <>
      {imageUrl && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          visible={!wireframe}
          scale={calculateScale()}
          position={position()}
          url={imageUrl}
        />
      )}
    </>
  );
});

export default BackgroundImage;
