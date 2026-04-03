import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { InventoryPage } from "./pages/InventoryPage.js";
import { CartPage } from "./pages/CartPage.js";
import { CheckoutPage } from "./pages/CheckoutPage.js";

test("test", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  const loginPage = new LoginPage(page);
  const checkoutPage = new CheckoutPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  await loginPage.goto();
  await loginPage.autoLogin();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  const itemCount = await page.locator('[data-test="inventory-item"]').count();
  console.log(`Number of items on inventory page: ${itemCount}`);
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);

  const itemName = await inventoryPage.verifyFirstItemFieldsAndAddToCart();

  await cartPage.goto();

  //verify that the cart contains the item that was added
  await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(
    itemName,
  );
  console.log(`Verified that the cart contains the item: ${itemName}`);

  //verify that the cart badge shows the correct number of items in the cart
  const cartBadge = page.locator('[data-test="shopping-cart-link"] span');
  const cartItems = page.locator('[data-test="inventory-item-name"]');
  const itemsCount = await cartItems.count();
  const badgeText = await cartBadge.textContent();

  expect(String(itemsCount)).toBe(badgeText.trim());
  console.log(
    `Cart badge shows ${badgeText} and contains ${itemsCount} items as expected.`,
  );

  // Proceed to checkout and verify that the checkout contains the correct item
  await checkoutPage.goto();
  await checkoutPage.fillCheckoutForm("TestName", "TestLastname", "0000");

  //Make sure the checkout overview page contains the correct item
  await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(
    itemName,
  );

  //verify that the checkout was successful and the order was completed
  console.log(`Verified that the checkout contains the item: ${itemName}`);

  await checkoutPage.finishOrder();
  await checkoutPage.getOrderConfirmation();
});
