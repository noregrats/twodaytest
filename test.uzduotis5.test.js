import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { InventoryPage } from "./pages/InventoryPage.js";
import { CartPage } from "./pages/CartPage.js";
import { CheckoutPage } from "./pages/CheckoutPage.js";

test("try to checkout with empty cart", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.autoLogin();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  await inventoryPage.addItemToCart(0);
  await inventoryPage.addItemToCart(1);
  expect(await inventoryPage.getCartBadgeCount()).toBe(2);

  await cartPage.goto();
  await cartPage.proceedToCheckout();
  await checkoutPage.tryCheckoutWithEmptyFieldsAndConfirmError();
});
