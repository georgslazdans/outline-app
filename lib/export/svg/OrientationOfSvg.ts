import Orientation from "@/lib/Orientation";

export const extractOrientationOf = (svgString: string): Orientation => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.querySelector("svg");
  const pathElement = svgDoc.querySelector("path");

  if (!svgElement || !pathElement) {
    throw new Error("Invalid SVG: Missing <svg> or <path> element.");
  }
  const viewBox = svgElement.getAttribute("viewBox");

  if (viewBox) {
    const [minX, minY, width, height] = viewBox.split(" ").map(Number);
    if (width >= height) {
      return Orientation.LANDSCAPE;
    } else if (height > width) {
      return Orientation.PORTRAIT;
    }
  }
  return Orientation.LANDSCAPE;
};
