import { calculatePathBounds } from "./PathBounds";

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
