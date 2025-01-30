import React, { FormEvent, ReactNode, useRef } from "react";
import Button from "../Button";

type Props = {
  id: string;
  className?: string;
  children?: ReactNode;
  onChange: any;
};

const PhotoCapture = ({ id, className, children, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (event: FormEvent<HTMLButtonElement>) => {
    if (inputRef.current) {
      event.preventDefault();
      inputRef.current.click();
    }
  };

  return (
    <>
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
      <Button className={className} onClick={handleButtonClick}>
        <label htmlFor={id}>{children}</label>
      </Button>
    </>
  );
};

export default PhotoCapture;
