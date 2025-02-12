import { ReactNode, useMemo, useState } from "react";
import HorizontalLine from "./HorizontalLine";
import VerticalLine from "./VerticalLine";
import SplitCut, {
  forSplitCut,
  splitCutUsing,
} from "@/lib/replicad/model/item/gridfinity/SplitCut";
import deepEqual from "@/lib/utils/Objects";
import { selectors } from "@playwright/test";

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

  const [highlighted, setHighlighted] = useState<SplitCut | undefined>();
  const [selected, setSelected] = useState<SplitCut[]>([]);

  const onVerticalHighlight = (x: number, y: number) => {
    const existing = selected.find((it) =>
      forSplitCut(it).containsVerticalLine(x, y)
    );
    if (existing) {
      setHighlighted(existing);
    } else {
      setHighlighted(
        splitCutUsing(xCount, yCount, selected).createVertical(x, y)
      );
    }
  };

  const onHorizontalHighlight = (x: number, y: number) => {
    const existing = selected.find((it) =>
      forSplitCut(it).containsHorizontalLine(x, y)
    );
    if (existing) {
      setHighlighted(existing);
    } else {
      setHighlighted(
        splitCutUsing(xCount, yCount, selected).createHorizontal(x, y)
      );
    }
  };

  const updateSelected = (cut: SplitCut) => {
    setSelected((previous) => {
      const existing = previous.find((it) => deepEqual(it, cut));
      if (existing) {
        const updated = previous.filter((it) => it != existing);

        return updated
          .map((it) => {
            const { x, y } = it.start;
            if (forSplitCut(it).isVertical()) {
              return splitCutUsing(xCount, yCount, updated).createVertical(
                x,
                y
              );
            } else {
              return splitCutUsing(xCount, yCount, updated).createHorizontal(
                x,
                y
              );
            }
          })
          .filter(
            (item, index, self) =>
              index === self.findIndex((other) => deepEqual(item, other))
          );
      } else {
        return [...previous, cut];
      }
    });
  };

  const onVerticalSelect = (x: number, y: number) => {
    const existing = selected.find((it) =>
      forSplitCut(it).containsVerticalLine(x, y)
    );
    if (existing) {
      updateSelected(existing);
    } else {
      updateSelected(
        splitCutUsing(xCount, yCount, selected).createVertical(x, y)
      );
    }
  };

  const onHorizontalSelect = (x: number, y: number) => {
    const existing = selected.find((it) =>
      forSplitCut(it).containsHorizontalLine(x, y)
    );
    if (existing) {
      updateSelected(existing);
    } else {
      updateSelected(
        splitCutUsing(xCount, yCount, selected).createHorizontal(x, y)
      );
    }
  };

  const onHighlightLeave = () => {
    setHighlighted(undefined);
  };

  const drawGrid = (
    color: string,
    drawVertical: (x: number, y: number) => boolean,
    drawHorizontal: (x: number, y: number) => boolean
  ) => {
    return asGrid(xCount, yCount).forEach((x, y) => {
      return (
        <>
          {drawVertical(x, y) && (
            <VerticalLine
              x={x}
              y={y}
              xCount={xCount}
              yCount={yCount}
              color={color}
              onHighlight={onVerticalHighlight}
              onHighlightLeave={onHighlightLeave}
              onSelect={onVerticalSelect}
            ></VerticalLine>
          )}

          {drawHorizontal(x, y) && (
            <HorizontalLine
              x={x}
              y={y}
              xCount={xCount}
              yCount={yCount}
              color={color}
              onHighlight={onHorizontalHighlight}
              onHighlightLeave={onHighlightLeave}
              onSelect={onHorizontalSelect}
            ></HorizontalLine>
          )}
        </>
      );
    });
  };

  const baseGrid = useMemo(() => {
    {
      return drawGrid(
        "black",
        () => true,
        () => true
      );
    }
  }, []);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="border">
      {baseGrid}
      {drawGrid(
        "purple",
        (x, y) => {
          return (
            selected.find((it) => forSplitCut(it).containsVerticalLine(x, y)) !=
            null
          );
        },
        (x, y) => {
          return (
            selected.find((it) =>
              forSplitCut(it).containsHorizontalLine(x, y)
            ) != null
          );
        }
      )}
      {drawGrid(
        "red",
        forSplitCut(highlighted).containsVerticalLine,
        forSplitCut(highlighted).containsHorizontalLine
      )}
    </svg>
  );
};

export default GridfinityGrid;
