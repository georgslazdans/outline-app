import React, { ChangeEventHandler, ReactNode } from "react";
import Button from "../Button";

type Props = {
  id: string;
  className?: string;
  children?: ReactNode;
  onChange: any;
};

const ImageUpload = ({ id, className, children, onChange }: Props) => {
  return (
    <Button className={className}>
      <label className="font-bold text-2xl" htmlFor={id}>
        {children}
      </label>
      <input
        className="hidden"
        type="file"
        id={id}
        name={id}
        accept="image/*"
        onChange={onChange}
      />
    </Button>
  );
};

export default ImageUpload;
