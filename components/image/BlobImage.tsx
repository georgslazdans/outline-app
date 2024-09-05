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
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={`${className}`}
        src={imageUrl}
        alt="Newly added image"
      />
    );
  }
};

export default BlobImage;
