// @ts-nocheck
// Copied from https://replicad.xyz/docs/examples/gridfinity
import {
  draw,
  drawRoundedRectangle,
  drawCircle,
  makeSolid,
  assembleWire,
  makeFace,
  EdgeFinder,
} from "replicad";
import ReplicadModelData from "./ReplicadModelData";

const defaultParams = {
  xSize: 2,
  ySize: 1,
  height: 0.5,
  withMagnet: false,
  withScrew: false,
  magnetRadius: 3.25,
  magnetHeight: 2,
  screwRadius: 1.5,
  keepFull: false,
  insideHeight: 0,
  wallThickness: 1.2,
  gridSize: 42.0,
  includeLip: true,
};

// Gridfinity magic numbers
const CLEARANCE = 0.5;
const AXIS_CLEARANCE = (CLEARANCE * Math.sqrt(2)) / 4;

const CORNER_RADIUS = 4;
const TOP_FILLET = 0.6;

const SOCKET_HEIGHT = 5;
const SOCKET_SMALL_TAPER = 0.8;
const SOCKET_BIG_TAPER = 2.4;
const SOCKET_VERTICAL_PART =
  SOCKET_HEIGHT - SOCKET_SMALL_TAPER - SOCKET_BIG_TAPER;
const SOCKET_TAPER_WIDTH = SOCKET_SMALL_TAPER + SOCKET_BIG_TAPER;

const socketProfile = (_: any, startPoint) => {
  const full = draw([-CLEARANCE / 2, 0])
    .vLine(-CLEARANCE / 2)
    .lineTo([-SOCKET_BIG_TAPER, -SOCKET_BIG_TAPER])
    .vLine(-SOCKET_VERTICAL_PART)
    .line(-SOCKET_SMALL_TAPER, -SOCKET_SMALL_TAPER)
    .done()
    .translate(CLEARANCE / 2, 0);

  return full.sketchOnPlane("XZ", startPoint);
};

const buildSocket = ({
  magnetRadius = 3.25,
  magnetHeight = 2,
  screwRadius = 1.5,
  withScrew = true,
  withMagnet = true,
  gridSize,
} = {}) => {
  const baseSocket = drawRoundedRectangle(
    gridSize - CLEARANCE,
    gridSize - CLEARANCE,
    CORNER_RADIUS
  ).sketchOnPlane();

  const slotSide = baseSocket.sweepSketch(socketProfile, {
    withContact: true,
  });

  let slot = makeSolid([
    slotSide,
    makeFace(
      assembleWire(
        new EdgeFinder().inPlane("XY", -SOCKET_HEIGHT).find(slotSide)
      )
    ),
    makeFace(assembleWire(new EdgeFinder().inPlane("XY", 0).find(slotSide))),
  ]);

  if (withScrew || withMagnet) {
    const magnetCutout = withMagnet
      ? drawCircle(magnetRadius).sketchOnPlane().extrude(magnetHeight)
      : null;
    const screwCutout = withScrew
      ? drawCircle(screwRadius).sketchOnPlane().extrude(SOCKET_HEIGHT)
      : null;

    const cutout =
      magnetCutout && screwCutout
        ? magnetCutout.fuse(screwCutout)
        : magnetCutout || screwCutout;

    slot = slot
      .cut(cutout.clone().translate([-13, -13, -5]))
      .cut(cutout.clone().translate([-13, 13, -5]))
      .cut(cutout.clone().translate([13, 13, -5]))
      .cut(cutout.clone().translate([13, -13, -5]));
  }

  return slot;
};

const range = (i) => [...Array(i).keys()];
const cloneOnGrid = (
  shape,
  { xSteps = 1, ySteps = 1, span = 10, xSpan = null, ySpan = null },
  gridSize
) => {
  const xCorr = ((xSteps - 1) * (xSpan || span)) / 2;
  const yCorr = ((ySteps - 1) * (ySpan || xSpan || span)) / 2;

  const translations = range(xSteps).flatMap((i) => {
    return range(ySteps).map((j) => [
      i * gridSize - xCorr,
      j * gridSize - yCorr,
      0,
    ]);
  });
  return translations.map((translation) =>
    shape.clone().translate(translation)
  );
};

const buildTopShape = ({
  xSize,
  ySize,
  includeBottomLip = true,
  wallThickness = 1.2,
  gridSize,
}) => {
  const topShape = (basePlane, startPosition) => {
    const sketcher = draw([-SOCKET_TAPER_WIDTH, 0])
      .line(SOCKET_SMALL_TAPER, SOCKET_SMALL_TAPER)
      .vLine(SOCKET_VERTICAL_PART)
      .line(SOCKET_BIG_TAPER, SOCKET_BIG_TAPER);

    if (includeBottomLip) {
      sketcher
        .vLineTo(-(SOCKET_TAPER_WIDTH + wallThickness))
        .lineTo([-SOCKET_TAPER_WIDTH, -wallThickness]);
    } else {
      sketcher.vLineTo(0);
    }

    const basicShape = sketcher.close();

    const shiftedShape = basicShape
      .translate(AXIS_CLEARANCE, -AXIS_CLEARANCE)
      .intersect(
        drawRoundedRectangle(10, 10).translate(-5, includeBottomLip ? 0 : 5)
      );

    // We need to shave off the clearance
    let topProfile = shiftedShape
      .translate(CLEARANCE / 2, 0)
      .intersect(drawRoundedRectangle(10, 10).translate(-5, 0));

    if (includeBottomLip) {
      // We remove the wall if we add a lip
      topProfile = topProfile.cut(
        drawRoundedRectangle(1.2, 10).translate(-0.6, -5)
      );
    }

    return topProfile.sketchOnPlane("XZ", startPosition);
  };

  const boxSketch = drawRoundedRectangle(
    xSize * gridSize - CLEARANCE,
    ySize * gridSize - CLEARANCE,
    CORNER_RADIUS
  ).sketchOnPlane();

  return boxSketch
    .sweepSketch(topShape, { withContact: true })
    .fillet(TOP_FILLET, (e) =>
      e.inBox(
        [-xSize * gridSize, -ySize * gridSize, SOCKET_HEIGHT],
        [xSize * gridSize, ySize * gridSize, SOCKET_HEIGHT - 1]
      )
    );
};

// Base is always 1u = 7mm. Height shouldn't be lower than 1
// Socket is 5mm. Add 2mm to complete the 1u
const gridfinityHeightOf = (zValue: number) => {
  return (zValue - 1) * 7 + 2;
}

function gridfinityBox({
  xSize = 2,
  ySize = 1,
  height = 3,
  keepFull = false,
  insideHeight = 0,
  wallThickness = 1.2,
  withMagnet = false,
  withScrew = false,
  magnetRadius = 3.25,
  magnetHeight = 2,
  screwRadius = 1.5,
  gridSize = 42.0,
  includeLip = true,
} = {}): ReplicadModelData {
  const stdHeight = gridfinityHeightOf(height);
  const insideStdHeight = gridfinityHeightOf(insideHeight);

  let box = drawRoundedRectangle(
    xSize * gridSize - CLEARANCE,
    ySize * gridSize - CLEARANCE,
    CORNER_RADIUS
  )
    .sketchOnPlane()
    .extrude(stdHeight);

  if (!keepFull) {
    box = box.shell(wallThickness, (f) => f.inPlane("XY", stdHeight));
    if (insideHeight > 0) {
      box = box.fuse(
        drawRoundedRectangle(
          xSize * gridSize - CLEARANCE,
          ySize * gridSize - CLEARANCE,
          CORNER_RADIUS
        )
          .sketchOnPlane()
          .extrude(insideStdHeight)
      );
    }
  }

  const socket = buildSocket({
    withMagnet,
    withScrew,
    magnetRadius,
    magnetHeight,
    screwRadius,
    gridSize,
  });

  let base = null;
  cloneOnGrid(
    socket,
    { xSteps: xSize, ySteps: ySize, span: gridSize },
    gridSize
  ).forEach((movedSocket) => {
    if (base) base = base.fuse(movedSocket, { optimisation: "commonFace" });
    else base = movedSocket;
  });

  if (includeLip) {
    const top = buildTopShape({
      xSize,
      ySize,
      includeBottomLip: !keepFull,
      gridSize,
    }).translateZ(stdHeight);

    // The optimization will not fuse correctly intersecting inside with the lip
    const isInsideCollidingWithLip = (stdHeight - insideStdHeight) < SOCKET_VERTICAL_PART;
    const fuseOptions = !isInsideCollidingWithLip ? { optimisation: "commonFace" } : {};
    return base
      .fuse(box, { optimisation: "commonFace" })
      .fuse(top, fuseOptions);
  } else {
    return base.fuse(box, { optimisation: "commonFace" });
  }
}

export default gridfinityBox;
