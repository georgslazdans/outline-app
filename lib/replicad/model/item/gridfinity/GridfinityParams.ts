type GridfinityParams = {
  xSize: number;
  ySize: number;
  height: number;
  keepFull: boolean;
  insideHeight: number;
  wallThickness: number;
  withMagnet: boolean;
  withScrew: boolean;
  magnetRadius: number;
  magnetHeight: number;
  screwRadius: number;
  gridSize: number;
  includeLip: boolean;
};

export const defaultGridfinityParams = (): GridfinityParams => {
  return {
    xSize: 5,
    ySize: 2,
    height: 3,
    keepFull: true,
    insideHeight: 0,
    wallThickness: 1.2,
    withMagnet: false,
    withScrew: false,
    magnetRadius: 3.25,
    magnetHeight: 2,
    screwRadius: 1.5,
    gridSize: 42.0,
    includeLip: true,
  };
};

export default GridfinityParams;
