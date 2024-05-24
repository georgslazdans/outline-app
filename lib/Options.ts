import { Option } from "@/components/SelectField";

namespace Options {
  export const of = (enumObject: Object) => {
    return {
      with: (dictionary: any, dictionaryPath: string) => {
        return Object.values(enumObject).map((value) => {
          return {
            value: value,
            label: dictionary[dictionaryPath][value],
          };
        });
      },
    };
  };
}

export default Options;
