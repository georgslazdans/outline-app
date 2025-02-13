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

type Props = {
  x: number;
  y: number;
  xCount: number;
  yCount: number;
  color: string;
  onHighlight: (x: number, y: number) => void;
  onHighlightLeave: () => void;
  onSelect: (x: number, y: number) => void;
};

const HorizontalLine = ({
  x,
  y,
  xCount,
  yCount,
  color,
  onHighlight,
  onHighlightLeave,
  onSelect,
}: Props) => {
  const points = linePointsFor(x, y, xCount, yCount);
  const id = `h-${x}-${y}`;
  const isClickable = y != 0 && y != yCount && x != xCount;

  return (
    <line
      key={id}
      x1={points.x1}
      y1={points.y1}
      x2={points.x2}
      y2={points.y2}
      stroke={color}
      strokeWidth={STROKE_WIDTH}
      onMouseEnter={() => isClickable && onHighlight(x, y)}
      onMouseLeave={() => isClickable && onHighlightLeave()}
      onClick={() => isClickable && onSelect(x, y)}
      cursor={isClickable ? "pointer" : ""}
    />
  );
};

export default HorizontalLine;
