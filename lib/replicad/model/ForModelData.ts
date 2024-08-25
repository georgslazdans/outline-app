import ModelData from "./ModelData";
import queriesFor from "./queries";
import modificationsFor from "./modification";

type ChainableAPI = ReturnType<typeof queriesFor> & {
  [K in keyof ReturnType<typeof modificationsFor>]: (
    ...args: Parameters<ReturnType<typeof modificationsFor>[K]>
  ) => ChainableAPI;
} & {
  getData: () => ModelData;
};

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
    useChaining: (): ChainableAPI => {
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
