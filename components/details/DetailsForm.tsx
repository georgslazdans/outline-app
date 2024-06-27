"use client";

import { FormEvent, useState } from "react";
import InputField from "../fiields/InputField";
import Button from "../Button";
import SelectField from "../fiields/SelectField";
import Orientation, { orientationOptionsFor } from "@/lib/Orientation";
import PaperSize, {
  PaperDimensions,
  paperSizeOptionsFor,
} from "@/lib/PaperSize";
import { Context, useDetails } from "@/context/DetailsContext";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { useIndexedDB } from "react-indexed-db-hook";
import { defaultSettings } from "@/lib/opencv/Settings";
import ImageField from "../image/ImageField";
import NumberField from "../fiields/NumberField";
import StepName from "@/lib/opencv/processor/steps/StepName";

type Props = {
  dictionary: any;
};

type Form = {
  name: string;
  orientation: string;
  width: number;
  height: number;
};

const DEFAULT_PAPER_SETTINGS = {
  name: "",
  orientation: Orientation.LANDSCAPE,
  width: 210,
  height: 297,
};

const paperSettingsOf = (context: Context) => {
  return context?.settings[StepName.EXTRACT_PAPER]?.paperSettings;
};

const DetailsForm = ({ dictionary }: Props) => {
  const router = useRouter();
  const { detailsContext, setDetailsContext } = useDetails();
  const { setLoading } = useLoading();
  const { add } = useIndexedDB("details");

  const [paperSize, setPaperSize] = useState("A4");

  const [formData, setFormData] = useState<Form>(
    paperSettingsOf(detailsContext) || defaultSettings
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handlePaperChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const size = event.target.value;
    setPaperSize(size);
    if (size != "custom") {
      const dimensions = PaperDimensions[size as PaperSize];
      setFormData({
        ...formData,
        width: dimensions.width,
        height: dimensions.height,
      });
    }
  };

  const handlePaperSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaperSize("custom");
    handleChange(event);
  };

  const onFormSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const settings = defaultSettings();
    settings.extractPaper.paperSettings = {
      width: formData.width,
      height: formData.height,
      orientation: formData.orientation as Orientation,
    };
    const newContext: Context = {
      ...detailsContext,
      details: {
        ...formData,
        orientation: formData.orientation as Orientation,
      },
      settings: settings,
      addDate: new Date(),
    };
    delete newContext.id;
    add(newContext).then(
      (dbId) => {
        setDetailsContext({ ...newContext, id: dbId });
        router.push("/calibration");
      },
      (error) => console.error(error)
    );
  };

  const paperSizeNumberRange = {
    min: 1,
    max: 1000000,
  };

  return (
    <form className="m-4 flex flex-col gap-3" onSubmit={onFormSave}>
      <ImageField
        dictionary={dictionary}
        detailsContext={detailsContext}
      ></ImageField>
      <InputField
        value={formData.name}
        onChange={handleChange}
        label={dictionary.details.name}
        name={"name"}
        type={"string"}
        autofocus
        required
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
        onChange={handlePaperChange}
      ></SelectField>
      <NumberField
        value={formData.width}
        onChange={handlePaperSizeChange}
        label={dictionary.details.width}
        name={"width"}
        numberRange={paperSizeNumberRange}
      ></NumberField>
      <NumberField
        value={formData.height}
        onChange={handlePaperSizeChange}
        label={dictionary.details.height}
        name={"height"}
        numberRange={paperSizeNumberRange}
      ></NumberField>
      <Button className="mt-4">
        <label>{dictionary.details.findOutline}</label>
      </Button>
    </form>
  );
};

export default DetailsForm;
