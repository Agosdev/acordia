import { test, expect } from "@playwright/test";
test("basic", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("ACORDIA")).toBeVisible();
});
