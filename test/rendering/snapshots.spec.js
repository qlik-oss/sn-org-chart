import { expect, test } from "@playwright/test";

test.describe("should render", () => {
  test.describe("from snapshot", () => {
    test("basic example", async ({ page }) => {
      await page.goto("/render?snapshot=basic", { waitUntil: "networkidle" });
      await page.waitForSelector(".sn-org-chart-snapshot", { visible: true });
      await expect(page).toHaveScreenshot();
    });
  });
});
