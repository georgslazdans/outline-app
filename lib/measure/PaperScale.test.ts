import { describe, expect, test } from "vitest";
import { pxPerMmFor, pxPerMmFromPaperQuad } from "./PaperScale";
import { pngSizeOf } from "@/lib/utils/ImagePng";
import StepName from "@/lib/opencv/processor/steps/StepName";
import CalibrationSettingStep from "@/components/calibration/simple/settings/CalibrationSettingStep";
import Settings from "@/lib/opencv/Settings";
import StepResult from "@/lib/opencv/StepResult";
import Orientation from "@/lib/Orientation";

const p = (x: number, y: number) => ({ x, y });

const a4Portrait = { width: 210, height: 297, orientation: Orientation.PORTRAIT };

// A 210x297mm paper quad drawn at 2 px/mm.
const quadAt2pxPerMm = [p(0, 0), p(420, 0), p(420, 594), p(0, 594)];

const settingsWith = (overrides: {
  skipPaperDetection?: boolean;
  paperIndex?: number;
}): Settings =>
  ({
    [StepName.INPUT]: { skipPaperDetection: overrides.skipPaperDetection ?? false },
    [StepName.EXTRACT_PAPER]: {
      paperSettings: a4Portrait,
      paperIndex: overrides.paperIndex ?? 0,
    },
  }) as unknown as Settings;

const pngHeader = (width: number, height: number): ArrayBuffer => {
  const buffer = new ArrayBuffer(24);
  const view = new DataView(buffer);
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  signature.forEach((byte, i) => view.setUint8(i, byte));
  view.setUint32(8, 13, false); // IHDR chunk length
  view.setUint8(12, 0x49); // I
  view.setUint8(13, 0x48); // H
  view.setUint8(14, 0x44); // D
  view.setUint8(15, 0x52); // R
  view.setUint32(16, width, false);
  view.setUint32(20, height, false);
  return buffer;
};

describe("pxPerMmFromPaperQuad", () => {
  test("derives the scale from the quad perimeter over the paper perimeter", () => {
    expect(
      pxPerMmFromPaperQuad(quadAt2pxPerMm, { width: 210, height: 297 })
    ).toBeCloseTo(2, 5);
  });

  test("returns undefined for fewer than three points", () => {
    expect(
      pxPerMmFromPaperQuad([p(0, 0), p(1, 1)], { width: 210, height: 297 })
    ).toBeUndefined();
  });
});

describe("pxPerMmFor", () => {
  test("paper step derives the scale from the paper quad", () => {
    const stepResults = [
      {
        stepName: StepName.FIND_PAPER_OUTLINE,
        pngBuffer: new ArrayBuffer(0),
        imageColorSpace: undefined,
        contours: [{ outline: { points: quadAt2pxPerMm } }],
      },
    ] as unknown as StepResult[];

    const result = pxPerMmFor({
      settingStep: CalibrationSettingStep.FIND_PAPER,
      stepResults,
      settings: settingsWith({}),
    });
    expect(result).toBeCloseTo(2, 5);
  });

  test("object step uses the resize-image scale factor", () => {
    const stepResults = [
      {
        stepName: StepName.RESIZE_IMAGE,
        pngBuffer: pngHeader(420, 594),
        imageColorSpace: undefined,
      },
    ] as unknown as StepResult[];

    const result = pxPerMmFor({
      settingStep: CalibrationSettingStep.FIND_OBJECT,
      stepResults,
      settings: settingsWith({}),
    });
    expect(result).toBeCloseTo(2, 5);
  });

  test("returns undefined when paper detection is skipped", () => {
    const stepResults = [
      {
        stepName: StepName.RESIZE_IMAGE,
        pngBuffer: pngHeader(420, 594),
        imageColorSpace: undefined,
      },
    ] as unknown as StepResult[];

    const result = pxPerMmFor({
      settingStep: CalibrationSettingStep.FIND_OBJECT,
      stepResults,
      settings: settingsWith({ skipPaperDetection: true }),
    });
    expect(result).toBeUndefined();
  });

  test("returns undefined for a paper step with no detected contours", () => {
    const result = pxPerMmFor({
      settingStep: CalibrationSettingStep.FIND_PAPER,
      stepResults: [],
      settings: settingsWith({}),
    });
    expect(result).toBeUndefined();
  });
});

describe("pngSizeOf", () => {
  test("reads width and height from a minimal PNG IHDR header", () => {
    expect(pngSizeOf(pngHeader(640, 480))).toStrictEqual({
      width: 640,
      height: 480,
    });
  });

  test("returns undefined for a buffer that is too short", () => {
    expect(pngSizeOf(new ArrayBuffer(10))).toBeUndefined();
  });

  test("returns undefined when the PNG signature is missing", () => {
    const buffer = pngHeader(640, 480);
    new DataView(buffer).setUint8(0, 0x00);
    expect(pngSizeOf(buffer)).toBeUndefined();
  });
});
