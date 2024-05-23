import React, { ChangeEventHandler, ReactNode } from "react";
import Button from "../Button";

type Props = {
  id: string;
  className?: string;
  children?: ReactNode;
  onChange: any;
};

const PhotoCapture = ({ id, className, children, onChange }: Props) => {
  return (
    <Button className={className}>
      <label htmlFor={id}>{children}</label>
      <input
        className="hidden"
        type="file"
        id={id}
        name={id}
        accept="image/*"
        capture="environment"
        onChange={onChange}
      />
    </Button>
  );
};

export default PhotoCapture;
