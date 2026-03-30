import { test, expect } from "@playwright/test";

test("saucedemo first two prices as integers", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  const username = await page.evaluate(() => {
    const m = document.body.innerText.match(
      /Accepted usernames are:\s*([\w_]+)/,
    );
    return m?.[1] || "standard_user";
  });
  const password = await page.evaluate(() => {
    const m = document.body.innerText.match(
      /Password for all users:\s*([\w_]+)/,
    );
    return m?.[1] || "secret_sauce";
  });

  await page.fill('[data-test="username"]', username);
  await page.fill('[data-test="password"]', password);
  await page.click('[data-test="login-button"]');

  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await page.waitForSelector(".inventory_item", { state: "visible" });

  const sortSelector =
    (await page.$('select[data-test="product_sort_container"]')) !== null
      ? 'select[data-test="product_sort_container"]'
      : 'select[data-test="product-sort-container"]';

  await page.waitForSelector(sortSelector, { state: "visible" });
  await page.selectOption(sortSelector, "lohi");
  await page.waitForTimeout(500);

  const items = page.locator(".inventory_item");
  const itemCount = await items.count();
  console.log("inventory item count:", itemCount);

  if (itemCount < 2) {
    throw new Error(
      `Expected at least 2 inventory items but found ${itemCount}`,
    );
  }

  const firstPriceText =
    (
      await items.nth(0).locator(".inventory_item_price").textContent()
    )?.trim() ?? "";
  const secondPriceText =
    (
      await items.nth(1).locator(".inventory_item_price").textContent()
    )?.trim() ?? "";

  const firstPriceInt = Math.round(
    Number(firstPriceText.replace(/[^0-9.]/g, "")),
  );
  const secondPriceInt = Math.round(
    Number(secondPriceText.replace(/[^0-9.]/g, "")),
  );

  expect(Number.isFinite(firstPriceInt)).toBe(true);
  expect(Number.isFinite(secondPriceInt)).toBe(true);
  expect(firstPriceInt).toBeLessThanOrEqual(secondPriceInt);

  console.log(
    "firstPriceInt:",
    firstPriceInt,
    "secondPriceInt:",
    secondPriceInt,
  );
});
