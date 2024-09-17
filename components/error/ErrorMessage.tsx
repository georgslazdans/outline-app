"use client";
import React from "react";

type Props = {
  className?: string;
  text: string;
};

const ErrorMessage = ({ className, text }: Props) => {
  return (
    <div className={className}>
      <label className="text-red">{text}</label>
    </div>
  );
};

export default ErrorMessage;
