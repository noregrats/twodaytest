import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { InventoryPage } from "./pages/InventoryPage.js";
import { CartPage } from "./pages/CartPage.js";

test("saucedemo first two prices as integers", async ({ page }) => {
  const addedItems = []; //Declare array to store added item names
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.goto();
  await loginPage.autoLogin();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  await inventoryPage.addItemToCart(0);
  await inventoryPage.addItemToCart(1);
  expect(await inventoryPage.getCartBadgeCount()).toBe(2);

  await page.getByRole("button", { name: "Open Menu" }).click();
  await page.locator('[data-test="reset-sidebar-link"]').click();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toBeHidden();

  await page.reload();
  await cartPage.goto();
  await cartPage.isCartEmpty();
});
