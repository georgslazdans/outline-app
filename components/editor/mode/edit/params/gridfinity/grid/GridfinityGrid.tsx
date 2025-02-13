import { ReactNode, useCallback, useMemo } from "react";
import HorizontalLine from "./HorizontalLine";
import VerticalLine from "./VerticalLine";
import SplitCut, {
  forSplitCut,
  reconstructSplitCuts,
  splitCutUsing,
} from "@/lib/replicad/model/item/gridfinity/SplitCut";
import deepEqual from "@/lib/utils/Objects";
import { useGridfinitySplitContext } from "../../../GridfinitySplitContext";

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

  const { highlighted, setHighlighted, selected, setSelected } =
    useGridfinitySplitContext();

  const onVerticalHighlight = useCallback(
    (x: number, y: number) => {
      const existing = selected.find((it) =>
        forSplitCut(it).containsVerticalLine(x, y)
      );
      if (existing) {
        setHighlighted({ splitCut: existing, mousePoint: { x, y } });
      } else {
        const cut = splitCutUsing(xCount, yCount, selected).createVertical(
          x,
          y
        );
        setHighlighted({
          splitCut: cut,
          mousePoint: { x, y },
        });
      }
    },
    [selected, setHighlighted, xCount, yCount]
  );

  const onHorizontalHighlight = useCallback(
    (x: number, y: number) => {
      const existing = selected.find((it) =>
        forSplitCut(it).containsHorizontalLine(x, y)
      );
      if (existing) {
        setHighlighted({ splitCut: existing, mousePoint: { x, y } });
      } else {
        const cut = splitCutUsing(xCount, yCount, selected).createHorizontal(
          x,
          y
        );
        setHighlighted({ splitCut: cut, mousePoint: { x, y } });
      }
    },
    [selected, setHighlighted, xCount, yCount]
  );

  const updateSelected = useCallback(
    (cut: SplitCut) => {
      const existing = selected.find((it) => deepEqual(it, cut));
      if (existing) {
        const updated = selected.filter((it) => it != existing);
        setSelected(reconstructSplitCuts(xCount, yCount, updated));
      } else {
        setSelected([...selected, cut]);
      }
    },
    [selected, setSelected, xCount, yCount]
  );

  const onVerticalSelect = useCallback(
    (x: number, y: number) => {
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
    },
    [selected, updateSelected, xCount, yCount]
  );

  const onHorizontalSelect = useCallback(
    (x: number, y: number) => {
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
    },
    [selected, updateSelected, xCount, yCount]
  );

  const onHighlightLeave = useCallback(() => {
    setHighlighted(undefined);
  }, [setHighlighted]);

  const drawGrid = useCallback(
    (
      color: string,
      drawVertical: (x: number, y: number) => boolean,
      drawHorizontal: (x: number, y: number) => boolean
    ) => {
      return asGrid(xCount, yCount).forEach((x, y) => {
        return (
          <>
            {drawVertical(x, y) && (
              <VerticalLine
                key={`v-${x}-${y}-${color}`}
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
                key={`h-${x}-${y}-${color}`}
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
    },
    [
      onHighlightLeave,
      onHorizontalHighlight,
      onHorizontalSelect,
      onVerticalHighlight,
      onVerticalSelect,
      xCount,
      yCount,
    ]
  );

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const baseGrid = useMemo(() => {
    {
      return drawGrid(
        isDark ? "#F4F7F5" : "#0D0D0E",
        () => true,
        () => true
      );
    }
  }, [drawGrid, isDark]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="border scale-y-[-1]">
      {baseGrid}
      {drawGrid(
        "#1296b6",
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
        "#DA4167",
        forSplitCut(highlighted).containsVerticalLine,
        forSplitCut(highlighted).containsHorizontalLine
      )}
    </svg>
  );
};

export default GridfinityGrid;
