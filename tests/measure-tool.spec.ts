import { test, expect } from "@playwright/test";
import * as path from "path";

test.setTimeout(5 * 60 * 1000);

test("measure tool on the calibration contour viewer", async ({ page }) => {
  const waitForImageProcessing = async () => {
    await page.waitForTimeout(500);
    await page.getByTestId("tail-spin-svg").waitFor({ state: "hidden" });
  };

  // The eye button shows the eye-slash icon while the outline is drawn
  // (click would hide it) and the plain eye icon while it is hidden.
  const eyeButton = page.locator("#toggle-outline-overlay");
  const eyeIconPath = eyeButton.locator("path").first();
  const measureButton = page.getByTestId("measure-button");
  const overlay = page.getByTestId("measure-overlay");
  const readout = page.getByTestId("measure-readout");
  const vertices = page.getByTestId("measure-vertex");
  // Indices of contour vertices that are safe to click: not hidden under the
  // floating buttons and not overlapping any other vertex handle.
  const freeVertices: number[] = [];
  const outlineIsShown = () =>
    expect(eyeIconPath).toHaveAttribute("d", /^M3\.98/);
  const outlineIsHidden = () =>
    expect(eyeIconPath).toHaveAttribute("d", /^M2\.036/);

  await test.step("Upload tool.jpg and open calibration", async () => {
    await page.goto("/");

    const uploadButton = page.getByRole("button", { name: "From images" });
    await uploadButton.click();
    await page.setInputFiles("#upload", path.resolve(__dirname, "tool.jpg"));

    await expect(page).toHaveURL(/\/details$/, { timeout: 30_000 });

    await page.getByRole("textbox", { name: "Name" }).click();
    await page.getByRole("textbox", { name: "Name" }).fill("Measure Tool");
    await page.click("text=Find Outline");

    await expect(page).toHaveURL(/\/calibration\?id=1$/, { timeout: 30_000 });

    await waitForImageProcessing();
  });

  await test.step("No ruler button on the paper steps", async () => {
    // On the paper steps the displayed image is the resized photo, not the
    // extracted deskewed paper, so mm readouts would only be approximate: the
    // tool is not offered there at all.
    await expect(measureButton).toHaveCount(0);
    await expect(overlay).toHaveCount(0);
  });

  await test.step("Switch to the Find Object step", async () => {
    await page.getByRole("heading", { name: "Find Object" }).click();
    await waitForImageProcessing();

    await expect(measureButton).toBeVisible();
    // Regression guard for the blank-icon bug: an SVG path `d` must start with
    // a command letter, otherwise the browser renders nothing.
    await expect(measureButton.locator("path").first()).toHaveAttribute(
      "d",
      /^M/
    );
  });

  await test.step("Measure between two outline points shows mm", async () => {
    await measureButton.click();
    await expect(overlay).toBeVisible();

    // Object contours are dense (thousands of points): the overlay samples
    // them down to at most ~64 clickable handles instead of hiding them.
    expect(await vertices.count()).toBeGreaterThanOrEqual(4);

    // The eye/measure buttons float over the top-left of the image; skip any
    // vertex hidden underneath them or overlapping another vertex handle.
    const obstacles = (
      await Promise.all([
        eyeButton.boundingBox(),
        measureButton.boundingBox(),
      ])
    ).filter(
      (b): b is { x: number; y: number; width: number; height: number } =>
        b !== null
    );
    const centers: { x: number; y: number }[] = [];
    for (let i = 0; i < (await vertices.count()); i++) {
      const box = await vertices.nth(i).boundingBox();
      if (!box) {
        continue;
      }
      centers.push({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
    }
    for (let i = 0; i < centers.length; i++) {
      const { x: cx, y: cy } = centers[i];
      const covered = obstacles.some(
        (b) =>
          cx > b.x - 8 &&
          cx < b.x + b.width + 8 &&
          cy > b.y - 8 &&
          cy < b.y + b.height + 8
      );
      // Vertex handles have a 7 px radius: skip any that another handle
      // overlaps so clicks land unambiguously on the intended one.
      const crowded = centers.some(
        (c, j) => j !== i && Math.hypot(c.x - cx, c.y - cy) < 20
      );
      if (!covered && !crowded) {
        freeVertices.push(i);
      }
    }
    expect(freeVertices.length).toBeGreaterThanOrEqual(3);

    await vertices.nth(freeVertices[0]).hover();
    await expect(page.getByTestId("measure-candidate")).toBeVisible();

    await vertices.nth(freeVertices[0]).click();
    await expect(page.getByTestId("measure-point-a")).toBeVisible();

    await vertices.nth(freeVertices[1]).click();
    await expect(page.getByTestId("measure-point-b")).toBeVisible();
    await expect(readout).toHaveText(/\d+(\.\d)? mm/);
  });

  await test.step("Third click starts a new measurement", async () => {
    const firstReadout = await readout.textContent();
    const thirdVertex = vertices.nth(freeVertices[2]);
    const thirdCx = await thirdVertex.getAttribute("cx");

    await thirdVertex.click();

    // B is cleared, A moved onto the clicked vertex (within a fraction of a
    // pixel: the default mode interpolates on the segment instead of snapping),
    // readout switched to the "pick second point" hint.
    await expect(page.getByTestId("measure-point-b")).toHaveCount(0);
    const pointACx = parseFloat(
      (await page.getByTestId("measure-point-a").getAttribute("cx"))!
    );
    expect(Math.abs(pointACx - parseFloat(thirdCx!))).toBeLessThan(1);
    await expect(readout).not.toHaveText(firstReadout!);

    // Complete the second measurement so the readout survives leaving measure mode.
    const fourthVertex =
      freeVertices.length > 3 ? freeVertices[3] : freeVertices[0];
    await vertices.nth(fourthVertex).click();
    await expect(readout).toHaveText(/\d+(\.\d)? mm/);
  });

  await test.step("Escape leaves measure mode, readout stays", async () => {
    await page.keyboard.press("Escape");
    await expect(overlay).toHaveCount(0);
    await expect(readout).toHaveText(/\d+(\.\d)? mm/);
  });

  await test.step("M hotkey toggles measure mode", async () => {
    await page.keyboard.press("m");
    await expect(overlay).toBeVisible();
    await page.keyboard.press("m");
    await expect(overlay).toHaveCount(0);
  });

  await test.step("Ruler works with hidden outline and re-shows it", async () => {
    await outlineIsShown();
    await eyeButton.click();
    await outlineIsHidden();

    // The ruler stays available while the outline is hidden.
    await expect(measureButton).toBeVisible();

    await measureButton.click();
    await expect(overlay).toBeVisible();
    // Clicking the ruler forced the outline back on.
    await outlineIsShown();
  });

  await test.step("Toggling measure mode does not reprocess the image", async () => {
    await measureButton.click(); // off
    await expect(overlay).toHaveCount(0);
    await measureButton.click(); // on
    await expect(overlay).toBeVisible();
    await measureButton.click(); // off
    await expect(page.getByTestId("tail-spin-svg")).toBeHidden();
  });
});
