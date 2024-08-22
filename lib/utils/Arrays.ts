export const ensureMaxSize = (items: any[], maxItems: number): any[] => {
  if (items.length > maxItems) {
    return items.slice(-maxItems);
  }
  return items;
};
