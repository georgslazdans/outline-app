import React from "react";

type Props = {
  label: string;
  value: string;
};

const EntryField = ({ label, value }: Props) => {
  return (
    <>
      <div className="w-full flex flex-row">
        <div className="w-full">{label}</div>
        <div className="w-full">{value}</div>
      </div>
    </>
  );
};

export default EntryField;
