import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Dictionary } from "@/app/dictionaries";
import MeasureReadout from "./MeasureReadout";

// The component only reads this one key, so a minimal stub is enough.
const dictionary = {
  calibration: { measure: { distance: "Distance" } },
} as unknown as Dictionary;

const readoutText = (container: HTMLElement): string =>
  container.querySelector('[data-testid="measure-readout"]')?.textContent ?? "";

describe("MeasureReadout", () => {
  it("renders nothing without a hint or a measurement", () => {
    const { container } = render(<MeasureReadout dictionary={dictionary} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows the hint alone when there is no measurement", () => {
    const { container } = render(
      <MeasureReadout dictionary={dictionary} hint="Click the first point" />
    );
    const text = readoutText(container);
    expect(text).toBe("Click the first point");
    expect(text).not.toContain("Distance");
  });

  it("shows the measurement alone when there is no hint", () => {
    const { container } = render(
      <MeasureReadout dictionary={dictionary} measurement="8.42 mm" />
    );
    expect(readoutText(container)).toBe("Distance: 8.42 mm");
  });

  it("replaces the hint with the measurement once both are present", () => {
    const { container } = render(
      <MeasureReadout
        dictionary={dictionary}
        hint="Click the first point"
        measurement="8.42 mm"
      />
    );
    const text = readoutText(container);
    expect(text).toBe("Distance: 8.42 mm");
    expect(text).not.toContain("Click the first point");
  });
});
