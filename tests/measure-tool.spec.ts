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
  // Indices of contour vertices not hidden under the floating buttons.
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

  await test.step("Ruler button is visible on the Find Paper step", async () => {
    await expect(page.getByTestId("measure-button")).toBeVisible();
    await expect(page.getByTestId("measure-overlay")).toHaveCount(0);
  });

  await test.step("Measure between two paper corners shows mm", async () => {
    await page.getByTestId("measure-button").click();
    await expect(page.getByTestId("measure-overlay")).toBeVisible();

    const vertices = page.getByTestId("measure-vertex");
    expect(await vertices.count()).toBeGreaterThanOrEqual(4);

    // The eye/measure buttons float over the top-left of the image; skip any
    // vertex corner hidden underneath them.
    const obstacles = (
      await Promise.all([
        eyeButton.boundingBox(),
        page.getByTestId("measure-button").boundingBox(),
      ])
    ).filter(
      (b): b is { x: number; y: number; width: number; height: number } =>
        b !== null
    );
    for (let i = 0; i < (await vertices.count()); i++) {
      const box = await vertices.nth(i).boundingBox();
      if (!box) {
        continue;
      }
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      const covered = obstacles.some(
        (b) =>
          b &&
          cx > b.x - 8 &&
          cx < b.x + b.width + 8 &&
          cy > b.y - 8 &&
          cy < b.y + b.height + 8
      );
      if (!covered) {
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
    await expect(page.getByTestId("measure-readout")).toHaveText(
      /\d+(\.\d)? mm/
    );
  });

  await test.step("Third click starts a new measurement", async () => {
    const firstReadout = await page
      .getByTestId("measure-readout")
      .textContent();
    const thirdVertex = page.getByTestId("measure-vertex").nth(freeVertices[2]);
    const thirdCx = await thirdVertex.getAttribute("cx");

    await thirdVertex.click();

    // B is cleared, A moved onto the clicked vertex (within a fraction of a
    // pixel: the default mode interpolates on the segment instead of snapping),
    // readout switched to the "pick second point" hint.
    await expect(page.getByTestId("measure-point-b")).toHaveCount(0);
    const pointACx = parseFloat(
      (await page
        .getByTestId("measure-point-a")
        .getAttribute("cx"))!
    );
    expect(Math.abs(pointACx - parseFloat(thirdCx!))).toBeLessThan(1);
    await expect(page.getByTestId("measure-readout")).not.toHaveText(
      firstReadout!
    );

    // Complete the second measurement so the readout survives leaving measure mode.
    const fourthVertex =
      freeVertices.length > 3 ? freeVertices[3] : freeVertices[0];
    await page
      .getByTestId("measure-vertex")
      .nth(fourthVertex)
      .click();
    await expect(page.getByTestId("measure-readout")).toHaveText(
      /\d+(\.\d)? mm/
    );
  });

  await test.step("Escape leaves measure mode, readout stays", async () => {
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("measure-overlay")).toHaveCount(0);
    await expect(page.getByTestId("measure-readout")).toHaveText(
      /\d+(\.\d)? mm/
    );
  });

  await test.step("Ruler works with hidden outline and re-shows it", async () => {
    await outlineIsShown();
    await eyeButton.click();
    await outlineIsHidden();

    // The ruler stays available while the outline is hidden.
    await expect(page.getByTestId("measure-button")).toBeVisible();

    await page.getByTestId("measure-button").click();
    await expect(page.getByTestId("measure-overlay")).toBeVisible();
    // Clicking the ruler forced the outline back on.
    await outlineIsShown();
  });

  await test.step("Toggling measure mode does not reprocess the image", async () => {
    await page.getByTestId("measure-button").click(); // off
    await expect(page.getByTestId("measure-overlay")).toHaveCount(0);
    await page.getByTestId("measure-button").click(); // on
    await expect(page.getByTestId("measure-overlay")).toBeVisible();
    await page.getByTestId("measure-button").click(); // off
    await expect(page.getByTestId("tail-spin-svg")).toBeHidden();
  });
});
