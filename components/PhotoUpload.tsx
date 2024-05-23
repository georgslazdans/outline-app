import React, { ReactNode } from "react";
import Button from "./Button";

type Props = {
  id: string;
  className?: string;
  children?: ReactNode;
};

const PhotoUpload = ({id, className, children }: Props) => {
  return (
    <Button className={className}>
      <label className="font-bold text-2xl" htmlFor={id}>{children}</label>
      <input
        className="hidden"
        type="file"
        id={id}
        name={id}
        accept="image/*"
        capture="environment"
      />
    </Button>
  );
};

export default PhotoUpload;
