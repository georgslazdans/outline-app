import { describe, expect, test, vi } from "vitest";

// pxPerMmFor only does PNG/scale math, but it imports Settings, which pulls in
// the OpenCV processing steps. Stub the WASM module so the unit test does not
// have to initialise OpenCV (which never resolves under jsdom). Only the
// constructors used at module top level need to be real.
vi.mock("@techstark/opencv-js", () => ({
  Scalar: class {
    constructor(..._args: unknown[]) {}
  },
  Mat: class {
    constructor(..._args: unknown[]) {}
  },
  MatVector: class {
    constructor(..._args: unknown[]) {}
  },
}));

import { pxPerMmFor } from "./PaperScale";
import { pngSizeOf } from "@/lib/utils/ImagePng";
import StepName from "@/lib/opencv/processor/steps/StepName";
import Settings from "@/lib/opencv/Settings";
import StepResult from "@/lib/opencv/StepResult";
import Orientation from "@/lib/Orientation";

const a4Portrait = { width: 210, height: 297, orientation: Orientation.PORTRAIT };

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

describe("pxPerMmFor", () => {
  test("object step uses the extracted-paper image scale factor", () => {
    const stepResults = [
      {
        stepName: StepName.EXTRACT_PAPER,
        pngBuffer: pngHeader(420, 594),
        imageColorSpace: undefined,
      },
    ] as unknown as StepResult[];

    const result = pxPerMmFor({
      stepResults,
      settings: settingsWith({}),
    });
    expect(result).toBeCloseTo(2, 5);
  });

  test("derives a scale from the resized image when paper detection is skipped", () => {
    const stepResults = [
      {
        stepName: StepName.RESIZE_IMAGE,
        pngBuffer: pngHeader(420, 594),
        imageColorSpace: undefined,
      },
    ] as unknown as StepResult[];

    const result = pxPerMmFor({
      stepResults,
      settings: settingsWith({ skipPaperDetection: true }),
    });
    expect(result).toBeCloseTo(2, 5);
  });

  test("returns undefined when the relevant step is missing", () => {
    const result = pxPerMmFor({
      stepResults: [],
      settings: settingsWith({}),
    });
    expect(result).toBeUndefined();
  });

  test("returns undefined for an empty placeholder buffer", () => {
    const stepResults = [
      {
        stepName: StepName.EXTRACT_PAPER,
        pngBuffer: new ArrayBuffer(0),
        imageColorSpace: undefined,
      },
    ] as unknown as StepResult[];

    const result = pxPerMmFor({
      stepResults,
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

  test("throws for a buffer that is too short", () => {
    expect(() => pngSizeOf(new ArrayBuffer(10))).toThrow();
  });

  test("throws when the PNG signature is missing", () => {
    const buffer = pngHeader(640, 480);
    new DataView(buffer).setUint8(0, 0x00);
    expect(() => pngSizeOf(buffer)).toThrow();
  });
});
