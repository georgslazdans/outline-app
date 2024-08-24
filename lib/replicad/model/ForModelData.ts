import ModelData from "./ModelData";
import queriesFor from "./queries";
import modificationsFor from "./modification";

export const forModelData = (data: ModelData) => {
  const modifications = modificationsFor(data);

  const asChainableFunction = (fn: (...args: any[]) => ModelData) => {
    return (...args: any[]) => {
      const result = fn(...args);
      return forModelData(result).useChaining();
    };
  };

  const chainableModificationsFor = () => {
    const entries = Object.entries(modifications).map(([key, fn]) => [
      key as string,
      asChainableFunction(fn),
    ]);

    return Object.fromEntries(entries);
  };

  return {
    ...queriesFor(data),
    ...modifications,
    useChaining: () => {
      return {
        ...queriesFor(data),
        ...chainableModificationsFor(),
        getData: () => {
          return data;
        },
      };
    },
  };
};
