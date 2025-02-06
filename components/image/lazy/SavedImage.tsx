import BlobImage from "../BlobImage";
import { useSavedFile } from "@/lib/SavedFile";

type Props = {
  imageId?: number;
};

const SavedImage = ({ imageId }: Props) => {
  const imageBlob = useSavedFile(imageId);
  return (
    <>
      <BlobImage image={imageBlob}></BlobImage>
    </>
  );
};

export default SavedImage;
