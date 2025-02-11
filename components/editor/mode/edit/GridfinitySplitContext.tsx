import React, {
  createContext,
  useContext,
  ReactNode,
} from "react";

type GridfinitySplitContextType = {};

const GridfinitySplitContext = createContext<
  GridfinitySplitContextType | undefined
>(undefined);

export const GridfinitySplitContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <GridfinitySplitContext.Provider value={{}}>
      {children}
    </GridfinitySplitContext.Provider>
  );
};

export const useGridfinitySplitContext = (): GridfinitySplitContextType => {
  const context = useContext(GridfinitySplitContext);
  if (context === undefined) {
    throw new Error(
      "useGridfinitySplitContext must be used within an GridfinitySplitContextProvider"
    );
  }
  return context;
};
