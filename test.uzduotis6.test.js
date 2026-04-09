import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { InventoryPage } from "./pages/InventoryPage.js";
import { CartPage } from "./pages/CartPage.js";
import { CheckoutPage } from "./pages/CheckoutPage.js";

test("sorting items in inventory", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.autoLogin();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  await inventoryPage.sortBy("Price (low to high)");
  await inventoryPage.pricecheckLowHigh();
  await inventoryPage.logAllItemPricesParsed();
  console.log("----");
  await inventoryPage.sortBy("Price (high to low)");
  await inventoryPage.pricecheckHighLow();
  await inventoryPage.logAllItemPricesParsed();
});
