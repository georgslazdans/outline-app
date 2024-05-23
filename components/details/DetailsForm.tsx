"use client";

import { useState } from "react";
import InputField from "../InputField";
import Button from "../Button";

type Props = {
  dictionary: any;
};

const DetailsForm = ({ dictionary }: Props) => {
  const [name, setName] = useState("");
  const [orientation, setOrientation] = useState(
    dictionary.orientation.landscape
  );
  const [paperSize, setPaperSize] = useState("A4");
  const [width, setWidth] = useState(210);
  const [height, setHeight] = useState(297);

  return (
    <form className="m-4 flex flex-col gap-4">
      <InputField
        value={name}
        setValue={setName}
        label={dictionary.details.name}
        name={"name"}
        type={"string"}
      ></InputField>
      <InputField
        value={orientation}
        setValue={setOrientation}
        label={dictionary.details.orientation}
        name={"orientation"}
        type={"string"}
      ></InputField>
      <InputField
        value={paperSize}
        setValue={setPaperSize}
        label={dictionary.details.paperSize}
        name={"paperSize"}
        type={"string"}
      ></InputField>
      <InputField
        value={width}
        setValue={setWidth}
        label={dictionary.details.width}
        name={"width"}
        type={"number"}
      ></InputField>
      <InputField
        value={height}
        setValue={setHeight}
        label={dictionary.details.height}
        name={"height"}
        type={"number"}
      ></InputField>
      <Button>
        <label>{dictionary.details.findOutline}</label>
      </Button>
    </form>
  );
};

export default DetailsForm;
