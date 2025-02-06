"use client";

import { FormEvent, useEffect, useState } from "react";
import InputField from "../fields/InputField";
import Button from "../Button";
import SelectField from "../fields/SelectField";
import Orientation, { orientationOptionsFor } from "@/lib/Orientation";
import PaperSize, {
  PaperDimensions,
  paperSizeOfDimensions,
  paperSizeOptionsFor,
} from "@/lib/PaperSize";
import { Context, useDetails } from "@/context/DetailsContext";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { useIndexedDB } from "react-indexed-db-hook";
import { defaultSettings } from "@/lib/opencv/Settings";
import ImageField from "../fields/ImageField";
import NumberField from "../fields/NumberField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import useNavigationHistory from "@/context/NavigationHistory";
import { useErrorModal } from "../error/ErrorContext";
import { idQuery } from "@/lib/utils/UrlParams";
import { useSavedFile } from "@/lib/SavedFile";

type Props = {
  dictionary: any;
};

type Form = {
  name: string;
  orientation: string;
  width: number;
  height: number;
};

const paperSettingsOf = (context: Context) => {
  const settings = context?.settings;
  if (settings && settings[StepName.EXTRACT_PAPER]) {
    return settings[StepName.EXTRACT_PAPER]?.paperSettings;
  } else {
    return defaultSettings()[StepName.EXTRACT_PAPER].paperSettings;
  }
};

const paperSizeOfContext = (detailsContext: Context) => {
  const settings = detailsContext?.settings;
  const paperSettings = settings
    ? settings[StepName.EXTRACT_PAPER]?.paperSettings
    : null;
  if (paperSettings) {
    return paperSizeOfDimensions(paperSettings.width, paperSettings.height);
  } else {
    return "A4";
  }
};

const DetailsForm = ({ dictionary }: Props) => {
  const router = useRouter();
  const { addHistory } = useNavigationHistory();
  const { detailsContext, setDetailsContext } = useDetails();
  const { showError } = useErrorModal();
  const { setLoading } = useLoading();
  const { add } = useIndexedDB("details");

  const imageBlob = useSavedFile(detailsContext.imageFile);
  const [paperSize, setPaperSize] = useState(
    paperSizeOfContext(detailsContext)
  );

  const [formData, setFormData] = useState<Form>( // TODO what is this???
    paperSettingsOf(detailsContext) || defaultSettings
  );

  // Remove loading from previous screen, but not on form save
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handlePaperChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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

    const settings = detailsContext?.settings || defaultSettings();
    settings.extractPaper.paperSettings = {
      width: formData.width,
      height: formData.height,
      orientation: formData.orientation as Orientation,
    };
    const newContext: Context = {
      details: {
        ...formData,
        orientation: formData.orientation as Orientation,
      },
      settings: settings,
      addDate: new Date(),
      imageFile: detailsContext.imageFile,
      contours: [],
      paperImage: undefined,
    };
    delete newContext.id;
    add(newContext).then(
      (dbId) => {
        setDetailsContext({ ...newContext, id: dbId });
        addHistory("/details");
        router.push("/calibration" + "?" + idQuery(dbId.toString()));
      },
      (error) => {
        showError(error);
        setLoading(false);
      }
    );
  };

  const paperSizeNumberRange = {
    min: 1,
    max: 1000000,
  };

  return (
    <form
      className="m-4 flex flex-col gap-3 max-w-[60vh] mx-auto"
      onSubmit={onFormSave}
    >
      <ImageField
        dictionary={dictionary}
        blob={imageBlob}
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
      {paperSize == "custom" && (
        <>
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
        </>
      )}
      <Button className="mt-4">
        <label>{dictionary.details.findOutline}</label>
      </Button>
    </form>
  );
};

export default DetailsForm;
