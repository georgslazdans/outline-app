"use client";

import { FormEvent, useState } from "react";
import InputField from "../InputField";
import Button from "../Button";
import SelectField from "../SelectField";
import { orientationOptionsFor } from "@/lib/Orientation";
import PaperSize, { PaperDimensions, paperSizeOptionsFor } from "@/lib/PaperSize";

type Props = {
  dictionary: any;
};

type Form = {
  name: string;
  orientation: string;
  width: number;
  height: number;
};

const DetailsForm = ({ dictionary }: Props) => {
  const [paperSize, setPaperSize] = useState("A4");
  const [formData, setFormData] = useState<Form>({
    name: "",
    orientation: dictionary.orientation.portrait,
    width: 210,
    height: 297,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handlePaperSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const size = event.target.value;
    setPaperSize(size)
    const dimensions = PaperDimensions[size as PaperSize];
    setFormData({ ...formData, width: dimensions.width, height: dimensions.height });
  };

  const onFormSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form saved!", formData);
  };

  return (
    <form className="m-4 flex flex-col gap-4" onSubmit={onFormSave}>
      <InputField
        value={formData.name}
        onChange={handleChange}
        label={dictionary.details.name}
        name={"name"}
        type={"string"}
      ></InputField>
      <SelectField
        label={dictionary.details.orientation}
        name={"orientation"}
        options={orientationOptionsFor(dictionary)}
        value={formData.orientation}
        onChange={handleChange}
      ></SelectField>
      <SelectField
        label={dictionary.details.paperSize}
        name={"paperSize"}
        options={paperSizeOptionsFor(dictionary)}
        value={paperSize}
        onChange={handlePaperSizeChange}
      ></SelectField>
      <InputField
        value={formData.width}
        onChange={handleChange}
        label={dictionary.details.width}
        name={"width"}
        type={"number"}
      ></InputField>
      <InputField
        value={formData.height}
        onChange={handleChange}
        label={dictionary.details.height}
        name={"height"}
        type={"number"}
      ></InputField>
      <Button className="mt-4">
        <label>{dictionary.details.findOutline}</label>
      </Button>
    </form>
  );
};

export default DetailsForm;
