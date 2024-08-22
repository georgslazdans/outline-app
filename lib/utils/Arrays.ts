export const ensureMaxSize = (items: any[], maxItems: number): any[] => {
  if (items.length > maxItems) {
    return items.slice(-maxItems);
  }
  return items;
};

export const reorder = (
  list: any[],
  startIndex: number,
  endIndex: number
): any[] => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
