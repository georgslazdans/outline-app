import { SplitCut } from "@/lib/replicad/model/item/gridfinity/Modification";
import { ReactNode, useState } from "react";
import HorizontalLine from "./HorizontalLine";
import VerticalLine from "./VerticalLine";

type Props = {
  xCount: number;
  yCount: number;
};

export const CELL_SIZE = 30;
export const STROKE_WIDTH = 5;

const asGrid = (xCount: number, yCount: number) => {
  return {
    forEach: (fun: (x: number, y: number) => ReactNode): ReactNode => {
      return Array.from({ length: xCount + 1 }).map((_, x) => {
        return Array.from({ length: yCount + 1 }).map((_, y) => {
          return fun(x, y);
        });
      });
    },
  };
};

const GridfinityGrid = ({ xCount, yCount }: Props) => {
  const width = CELL_SIZE * xCount;
  const height = CELL_SIZE * yCount;

  const [highlighted, setHighlighted] = useState<SplitCut | null>(null);
  const [selected, setSelected] = useState<SplitCut | null>(null);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="border">
      {asGrid(xCount, yCount).forEach((x, y) => {
        return (
          <>
            {/* // TODO draw highlighted separately */}
            <VerticalLine
              x={x}
              y={y}
              xCount={xCount}
              yCount={yCount}
              highlighted={highlighted}
              onHighlight={setHighlighted}
            ></VerticalLine>

            <HorizontalLine
              x={x}
              y={y}
              xCount={xCount}
              yCount={yCount}
              highlighted={highlighted}
              onHighlight={setHighlighted}
            ></HorizontalLine>
          </>
        );
      })}
      {/* 
      {Array.from({ length: yCount + 1 }).map((_, y) => {
        return Array.from({ length: xCount + 1 }).map((_, x) => {
          return (
     
          );
        });
      })} */}
    </svg>
  );
};

export default GridfinityGrid;
