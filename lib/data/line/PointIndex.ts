export const nextIndex = (i: number, length: number) =>
  i === length - 1 ? 0 : i + 1;

export const previousIndex = (i: number, length: number) =>
  i === 0 ? length - 1 : i - 1;

const forwardIndexDistance = (from: number, to: number, pointCount: number) => {
  if (to > from) {
    return to - from - 1;
  } else {
    return pointCount - from + to - 1;
  }
};

const backwardIndexDistance = (
  from: number,
  to: number,
  pointCount: number
) => {
  if (from > to) {
    return from - to - 1;
  } else {
    return from + (pointCount - to) - 1;
  }
};

export const indexDistance = (from: number, to: number, pointCount: number) => {
  return {
    forward: () => forwardIndexDistance(from, to, pointCount),
    backward: () => backwardIndexDistance(from, to, pointCount),
  };
};

export const indexesBetween = (
  startIndex: number,
  endIndex: number,
  pointCount: number
): number[] => {
  const addIndexes = (start: number, end: number) => {
    const indexes: number[] = [];

    if (end > start) {
      for (let i = start; i != end; i = i + 1) {
        indexes.push(i);
      }
    } else {
      for (let i = start; i != pointCount; i = i + 1) {
        indexes.push(i);
      }
      for (let i = 0; i != end; i = i + 1) {
        indexes.push(i);
      }
    }
    indexes.push(end);
    return indexes;
  };

  return addIndexes(startIndex, endIndex);
};

export const updateIndexAfterDelete = (
  i: number,
  indexesToDelete: number[],
  pointCount: number
) => {
  let result = i;

  for (let index of indexesToDelete) {
    if (index < i) {
      result--;
    }
  }

  if (result >= 0) {
    return result;
  } else {
    return pointCount + result;
  }
};
