import SelectOption from "./SelectOption";

namespace Options {
  export const of = (enumObject: Object) => {
    return {
      withTranslation: (dictionary: any, dictionaryPath: string): SelectOption[] =>  {
        const values = removeDuplicatesIgnoreCase(Object.values(enumObject));
        return values.map((value) => {
          return {
            value: value,
            label: dictionary[dictionaryPath][value],
          };
        });
      },
    };
  };
}

const removeDuplicatesIgnoreCase = (arr: string[]): string[] => {
  const lowerCaseSet = new Set<string>();
  const result: string[] = [];

  arr.forEach(item => {
    const lowerCaseItem = item.toLowerCase();
    if (!lowerCaseSet.has(lowerCaseItem)) {
      lowerCaseSet.add(lowerCaseItem);
      result.push(item);
    }
  });

  return result;
}

export default Options;
