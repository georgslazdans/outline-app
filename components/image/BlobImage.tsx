"use client";

import React from "react";

type Props = {
  image: Blob;
  className?: string;
};

const BlobImage = ({ image, className = "" }: Props) => {
  if (image) {
    const imageUrl = URL.createObjectURL(image);
    return (
      <img
        className={`${className}`}
        src={imageUrl}
        alt="Newly added image"
      />
    );
  }
};

export default BlobImage;
