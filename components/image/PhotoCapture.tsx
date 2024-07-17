import React, { ReactNode, useRef } from "react";
import Button from "../Button";

type Props = {
  id: string;
  className?: string;
  children?: ReactNode;
  onChange: any;
};

const PhotoCapture = ({ id, className, children, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Button className={className} onClick={handleButtonClick}>
      <label htmlFor={id}>{children}</label>
      <input
        ref={inputRef}
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
