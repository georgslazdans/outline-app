import Point from "@/lib/data/Point";
import deepEqual from "@/lib/utils/Objects";

type SplitCut = {
  start: Point;
  end: Point;
};

export const forSplitCut = (splitCut?: SplitCut) => {
  const isVertical = (): boolean => {
    return !!splitCut && splitCut.start.x == splitCut.end.x;
  };
  const isHorizontal = (): boolean => {
    return !!splitCut && splitCut.start.y == splitCut.end.y;
  };
  const containsVerticalLine = (x: number, y: number) => {
    if (splitCut && isVertical()) {
      return (
        splitCut.start.x == x && splitCut.start.y <= y && splitCut.end.y > y
      );
    }
    return false;
  };

  const containsHorizontalLine = (x: number, y: number) => {
    if (splitCut && isHorizontal()) {
      return (
        splitCut.start.y == y && splitCut.start.x <= x && splitCut.end.x > x
      );
    }
    return false;
  };

  return {
    isVertical: isVertical,
    isHorizontal: isHorizontal,
    containsVerticalLine: containsVerticalLine,
    containsHorizontalLine: containsHorizontalLine,
  };
};

type Bounds = {
  topBound?: SplitCut;
  botBound?: SplitCut;
};

export const splitCutUsing = (
  xCount: number,
  yCount: number,
  existingCuts: SplitCut[]
) => {
  const findVerticalBounds = (lineX: number, lineY: number): Bounds => {
    if (existingCuts && existingCuts.length > 0) {
      const horizontalCuts = existingCuts
        .filter((it) => forSplitCut(it).isHorizontal())
        .filter((it) => it.start.x <= lineX && it.end.x >= lineX)
        .sort((a, b) => a.start.y - b.start.y);
      const topBounds = horizontalCuts.filter((it) => it.start.y > lineY);
      const botBounds = horizontalCuts.filter((it) => it.start.y <= lineY);
      return {
        topBound: topBounds.length > 0 ? topBounds[0] : undefined,
        botBound:
          botBounds.length > 0 ? botBounds[botBounds.length - 1] : undefined,
      };
    }
    return {
      topBound: undefined,
      botBound: undefined,
    };
  };
  const splitCutFromVertical = (lineX: number, lineY: number): SplitCut => {
    const { topBound, botBound } = findVerticalBounds(lineX, lineY);
    return {
      start: {
        x: lineX,
        y: botBound ? botBound.start.y : 0,
      },
      end: {
        x: lineX,
        y: topBound ? topBound.start.y : yCount,
      },
    };
  };

  const findHorizontalBounds = (lineX: number, lineY: number): Bounds => {
    if (existingCuts && existingCuts.length > 0) {
      const horizontalCuts = existingCuts
        .filter((it) => forSplitCut(it).isVertical())
        .filter((it) => it.start.y <= lineY && it.end.y >= lineY)
        .sort((a, b) => a.start.x - b.start.x);
      const topBounds = horizontalCuts.filter((it) => it.start.x > lineX);
      const botBounds = horizontalCuts.filter((it) => it.start.x <= lineX);
      return {
        topBound: topBounds.length > 0 ? topBounds[0] : undefined,
        botBound:
          botBounds.length > 0 ? botBounds[botBounds.length - 1] : undefined,
      };
    }
    return {
      topBound: undefined,
      botBound: undefined,
    };
  };
  const splitCutFromHorizontal = (lineX: number, lineY: number): SplitCut => {
    const { topBound, botBound } = findHorizontalBounds(lineX, lineY);
    return {
      start: {
        x: botBound ? botBound.start.x : 0,
        y: lineY,
      },
      end: {
        x: topBound ? topBound.start.x : xCount,
        y: lineY,
      },
    };
  };

  return {
    createVertical: splitCutFromVertical,
    createHorizontal: splitCutFromHorizontal,
  };
};

export const reconstructSplitCuts = (
  xCount: number,
  yCount: number,
  splitCuts: SplitCut[]
) => {
  const result: SplitCut[] = [];
  splitCuts.forEach((it) => {
    const { x, y } = it.start;
    if (forSplitCut(it).isVertical()) {
      result.push(splitCutUsing(xCount, yCount, result).createVertical(x, y));
    } else {
      result.push(splitCutUsing(xCount, yCount, result).createHorizontal(x, y));
    }
  });
  return result.filter(
    (item, index, self) =>
      index === self.findIndex((other) => deepEqual(item, other))
  );
};

export default SplitCut;
