import React, { ReactNode } from "react";

type Props = {
  id: string;
  children?: ReactNode;
};

const ImageUpload = ({id, children }: Props) => {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        type="file"
        id={id}
        name={id}
        accept="image/*"
        capture="environment"
      />
    </>
  );
};

export default ImageUpload;
