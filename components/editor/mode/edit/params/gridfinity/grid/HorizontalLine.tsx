import { SplitCut } from "@/lib/replicad/model/item/gridfinity/Modification";
import { CELL_SIZE, STROKE_WIDTH } from "./GridfinityGrid";

const linePointsFor = (
  x: number,
  y: number,
  xCount: number,
  yCount: number
) => {
  const isNotFirstOrLast = y != 0 && y != yCount;
  const x1 =
    x * CELL_SIZE + (x == 0 && isNotFirstOrLast ? STROKE_WIDTH / 2 : 0);
  const x2 =
    (x + 1) * CELL_SIZE -
    (x == xCount - 1 && isNotFirstOrLast ? STROKE_WIDTH / 2 : 0);
  const y1 = y * CELL_SIZE;
  return {
    x1: x1,
    x2: x2,
    y1: y1,
    y2: y1,
  };
};

const splitCutFromHorizontal = (
  lineX: number,
  lineY: number,
  xCount: number,
  yCount: number
): SplitCut => {
  return {
    start: {
      x: 0,
      y: lineY,
    },
    end: {
      x: xCount,
      y: lineY,
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

const HorizontalLine = ({
  x,
  y,
  xCount,
  yCount,
  highlighted,
  onHighlight,
}: Props) => {
  const points = linePointsFor(x, y, xCount, yCount);
  const id = `h-${x}-${y}`;
  const isClickable = y != 0 && y != yCount && x != xCount;

  const isHighlighted = () => {
    if (highlighted && highlighted.start.y == highlighted.end.y) {
      return highlighted.start.y == y;
    }
    return false;
  };

  const getColor = () => {
    return isHighlighted() ? "red" : "black";
  };

  const handleMouseEnter = () => {
    const splitCut = splitCutFromHorizontal(x, y, xCount, yCount);
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

export default HorizontalLine;
