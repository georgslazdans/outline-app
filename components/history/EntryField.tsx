import React from "react";

type Props = {
  label: string;
  value: string;
};

const EntryField = ({ label, value }: Props) => {
  return (
    <>
      <div>
        <div>{label}</div>
        <div>{value}</div>
      </div>
    </>
  );
};

export default EntryField;
