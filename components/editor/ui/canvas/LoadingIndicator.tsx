"use client";

import React from "react";
import { TailSpin } from "react-loader-spinner";
import { useModelCache } from "../../cache/ModelCacheContext";

type Props = {};

const LoadingIndicator = ({}: Props) => {
  const { isModelLoading } = useModelCache();
  return (
    <>
      {isModelLoading && (
        <div className="ml-2 mt-2">
          <TailSpin
            visible={true}
            height="48"
            width="48"
            ariaLabel="tail-spin-loading"
            radius="1"
            strokeWidth={5}
            wrapperStyle={{}}
            wrapperClass="loader"
          />
        </div>
      )}
    </>
  );
};

export default LoadingIndicator;
