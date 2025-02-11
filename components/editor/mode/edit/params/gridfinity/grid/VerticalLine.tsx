import { SplitCut } from "@/lib/replicad/model/item/gridfinity/Modification";
import { CELL_SIZE, STROKE_WIDTH } from "./GridfinityGrid";

const linePointsFor = (
  x: number,
  y: number,
  xCount: number,
  yCount: number
) => {
  const isNotFirstOrLast = x != 0 && x != xCount;
  const x1 = x * CELL_SIZE;
  const y1 =
    y * CELL_SIZE + (y == 0 && isNotFirstOrLast ? STROKE_WIDTH / 2 : 0);
  const y2 =
    (y + 1) * CELL_SIZE -
    (y == yCount - 1 && isNotFirstOrLast ? STROKE_WIDTH / 2 : 0);
  return {
    x1: x1,
    x2: x1,
    y1: y1,
    y2: y2,
  };
};

const splitCutFromVertical = (
  lineX: number,
  lineY: number,
  xCount: number,
  yCount: number
): SplitCut => {
  return {
    start: {
      x: lineX,
      y: 0,
    },
    end: {
      x: lineX,
      y: yCount,
    },
  };
};

type Props = {
  x: number;
  y: number;
  xCount: number;
  yCount: number;
  highlighted: SplitCut | null;
  onHighlight: (splitCut: SplitCut | null) => void;
};

const VerticalLine = ({
  x,
  y,
  xCount,
  yCount,
  highlighted,
  onHighlight,
}: Props) => {
  const points = linePointsFor(x, y, xCount, yCount);
  const id = `v-${x}-${y}`;
  const isClickable = x != 0 && x != xCount && y != yCount;

  const isHighlighted = () => {
    if (highlighted && highlighted.start.x == highlighted.end.x) {
      return highlighted.start.x == x;
    }
    return false;
  };

  const getColor = () => {
    return isHighlighted() ? "red" : "black";
  };

  const handleMouseEnter = () => {
    const splitCut = splitCutFromVertical(x, y, xCount, yCount);
    onHighlight(splitCut);
  };

  const handleMouseLeave = () => {
    onHighlight(null);
  };

  return (
    <line
      key={id}
      x1={points.x1}
      y1={points.y1}
      x2={points.x2}
      y2={points.y2}
      stroke={getColor()}
      strokeWidth={STROKE_WIDTH}
      onMouseEnter={() => isClickable && handleMouseEnter()}
      onMouseLeave={() => isClickable && handleMouseLeave()}
      //   onClick={() => isClickable && handleClick(id)}
      cursor={isClickable ? "pointer" : ""}
    />
  );
};

export default VerticalLine;
