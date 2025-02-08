export const adjustSvgForViewing = (
  svgString: string,
  border: number = 2
): string => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.querySelector("svg");
  const pathElement = svgDoc.querySelector("path");

  if (!svgElement || !pathElement) {
    throw new Error("Invalid SVG: Missing <svg> or <path> element.");
  }
  const path = pathElement.attributes.getNamedItem("d")?.value;
  // SVGRect {x: -93.98780822753906, y: 58.53658676147461, width: 178.4451446533203, height: 15.731708526611328}
  // -95.98780487804879 56.53658536585366 88.45731707317071 78.26829268292683
  if (path) {
    const bbox = calculatePathBounds(path);
    const minX = bbox.minX - border;
    const minY = bbox.minY - border;
    const width = bbox.maxX - bbox.minX + 2 * border;
    const height = bbox.maxY - bbox.minY + 2 * border;

    svgElement.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);
  }

  svgElement.removeAttribute("width");
  svgElement.removeAttribute("height");

  svgElement.setAttribute("style", "max-width: 100%; max-height: 100%;");

  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgElement);
};

const calculatePathBounds = (
  d: string
): { minX: number; minY: number; maxX: number; maxY: number } => {
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
