type PathBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export const pathBoundsFromSVG = (svgString: string): PathBounds => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.querySelector("svg");
  const pathElement = svgDoc.querySelector("path");

  if (!svgElement || !pathElement) {
    throw new Error("Invalid SVG: Missing <svg> or <path> element.");
  }
  const path = pathElement.attributes.getNamedItem("d")?.value;
  if (!path) {
    throw Error("Path data not found in <path>!");
  }
  return calculatePathBounds(path);
};

export const calculatePathBounds = (d: string): PathBounds => {
  const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g); // Split into commands and their parameters
  if (!commands) {
    throw new Error("Invalid path data");
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  let currentX = 0;
  let currentY = 0;

  commands.forEach((command) => {
    const type = command[0];
    const values = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number);

    switch (type) {
      case "M": // Move absolute
      case "L": // Line to absolute
        for (let i = 0; i < values.length; i += 2) {
          const x = values[i];
          const y = values[i + 1];
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          currentX = x;
          currentY = y;
        }
        break;

      case "m": // Move relative
      case "l": // Line to relative
        for (let i = 0; i < values.length; i += 2) {
          const x = currentX + values[i];
          const y = currentY + values[i + 1];
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          currentX = x;
          currentY = y;
        }
        break;

      case "H": // Horizontal line absolute
        values.forEach((x) => {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          currentX = x;
        });
        break;

      case "h": // Horizontal line relative
        values.forEach((x) => {
          currentX += x;
          minX = Math.min(minX, currentX);
          maxX = Math.max(maxX, currentX);
        });
        break;

      case "V": // Vertical line absolute
        values.forEach((y) => {
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
          currentY = y;
        });
        break;

      case "v": // Vertical line relative
        values.forEach((y) => {
          currentY += y;
          minY = Math.min(minY, currentY);
          maxY = Math.max(maxY, currentY);
        });
        break;

      case "Z": // Close path
      case "z":
        // No coordinates involved; do nothing
        break;

      default:
        console.warn(`Unsupported SVG command: ${type}`);
    }
  });

  return { minX, minY, maxX, maxY };
};
