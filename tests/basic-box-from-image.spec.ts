import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

test.setTimeout(5 * 60 * 1000);

test("E2E flow: upload image from home page", async ({ page }) => {
  const waitForImageProcessing = async () => {
    await page.waitForTimeout(500);
    await page.getByTestId("tail-spin-svg").waitFor({ state: "hidden" });
  };

  await test.step("Open the home page", async () => {
    await page.goto("/");
  });

  await test.step("Click 'From images' button", async () => {
    await page.click("text=From images");
  });

  await test.step("Upload file 'tool.jpg'", async () => {
    const uploadButton = page.getByRole("button", { name: "From images" });

    await uploadButton.click();
    const filePath = path.resolve(__dirname, "tool.jpg");
    await page.setInputFiles("#upload", filePath);

    await expect(page).toHaveURL(/\/details$/, { timeout: 30_000 });
  });

  await test.step("Add name and submit", async () => {
    await page.getByRole("textbox", { name: "Name" }).click();
    await page.getByRole("textbox", { name: "Name" }).fill("Paper Knife");
    await page.click("text=Find Outline");

    await expect(page).toHaveURL(/\/calibration\?id=1$/, { timeout: 30_000 });
  });

  await test.step("Await image processing and change threshold", async () => {
    await waitForImageProcessing();

    await page.getByRole("heading", { name: "Find Object" }).click();
    await page.getByLabel("Threshold Type").selectOption("binary");
    await waitForImageProcessing();

    await page.locator("#threshold-slider").fill("56");
    await waitForImageProcessing();

    await page.locator("#inverseThreshold-slider").fill("140");
    await waitForImageProcessing();
  });

  await test.step("Set hole settings and smooth value", async () => {
    await page
      .getByRole("heading", { name: "Hole Settings And Smoothing" })
      .click();

    await page.locator("#holeAreaThreshold-slider").fill("13.7");
    await waitForImageProcessing();

    await page.locator("#smoothAccuracy-slider").fill("6");
    await waitForImageProcessing();
  });

  await test.step("Assert that there are 3 objects to filter", async () => {
    await page.getByTestId("tail-spin-svg").waitFor({ state: "hidden" });
    await page.getByRole("heading", { name: "Filter Objects" }).click();
    const contourLabels = page.locator("text=/Contour (1|2|3)/");
    await expect(contourLabels).toHaveCount(3);
  });

  await test.step("Download and assert SVG export", async () => {
    await page.click("text=Contour 2");
    await waitForImageProcessing();
    await page.click("text=Contour 3");
    await waitForImageProcessing();
    await page.waitForTimeout(5000); // Wait for react to update state

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click("text=SVG"),
    ]);

    const suggestedFilename = download.suggestedFilename();
    console.log("Downloaded file:", suggestedFilename);

    const downloadPath = await download.path();
    if (!downloadPath) {
      throw new Error("Failed to download the file.");
    }

    const downloadedContent = await fs.promises.readFile(downloadPath, "utf-8");

    const expectedFilePath = path.resolve(__dirname, "test.svg");
    const expectedContent = await fs.promises.readFile(
      expectedFilePath,
      "utf-8"
    );

    expect(downloadedContent).toBe(expectedContent);
  });

  await test.step("Save and Close", async () => {
    await page.locator("text=Save and Close").nth(1).click();
    await expect(page).toHaveURL(/\/$/, { timeout: 30_000 });
  });

  await test.step("Open model editor", async () => {
    await page.click("text=Create model");
    await expect(page).toHaveURL(/\/editor$/, { timeout: 30_000 });
  });

  await test.step("Import contour", async () => {
    await page.locator("#add-contour-button:visible").click();
    await page.click("text=Import Contour");
  });

  await test.step("Scale along normals", async () => {
    await page.locator("#edit-contour-button:visible").click();
    await page.getByRole("spinbutton", { name: "Distance (mm)" }).fill("1");
    await page.locator("#scale-along-normal:visible").click();
    await page.click("text=Done");
  });

  await test.step("Render and compare STEP file", async () => {
    await page.click("text=Render");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click("text=Download STEP"),
    ]);

    const suggestedFilename = download.suggestedFilename();
    console.log("Downloaded file:", suggestedFilename);

    const downloadPath = await download.path();
    if (!downloadPath) {
      throw new Error("Failed to download the file.");
    }

    const downloadedContent = await fs.promises.readFile(downloadPath, "utf-8");

    const expectedFilePath = path.resolve(__dirname, "test.step");
    const expectedContent = await fs.promises.readFile(
      expectedFilePath,
      "utf-8"
    );

    const downloadedLines = downloadedContent.split(/\r?\n/);
    const expectedLines = expectedContent.split(/\r?\n/);

    // Compare only from line 11 onward (skip first 10 lines)
    expect(downloadedLines.slice(10)).toEqual(expectedLines.slice(10));
  });
});
