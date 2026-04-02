import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { InventoryPage } from "./pages/InventoryPage.js";
import { CartPage } from "./pages/CartPage.js";
import { CheckoutPage } from "./pages/CheckoutPage.js";

test("saucedemo first two prices as integers", async ({ page }) => {
  const addedItems = []; //Declare array to store added item names
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.autoLogin();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.waitForInventoryLoad();
  await inventoryPage.sortBy("lohi");

  const { firstPriceInt, secondPriceInt } =
    await inventoryPage.pricecheckLowHigh();
  expect(firstPriceInt).toBeLessThanOrEqual(secondPriceInt);

  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Add two items to the cart and verify the cart badge count
  const itemName0 = await inventoryPage.addItemToCart(0);
  addedItems.push(itemName0);
  expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  // Add second item to cart and verify badge count
  const itemName1 = await inventoryPage.addItemToCart(1);
  addedItems.push(itemName1);
  expect(await inventoryPage.getCartBadgeCount()).toBe(2);
  //  Add third item to cart and verify badge count
  const itemName2 = await inventoryPage.addItemToCart(2);
  addedItems.push(itemName2);
  expect(await inventoryPage.getCartBadgeCount()).toBe(3);

  // Remove one item from cart and verify badge count
  await inventoryPage.getCartBadgeCount();
  await cartPage.goto();
  const removedItem = await cartPage.removeFirstItem();
  addedItems.splice(addedItems.indexOf(removedItem), 1);
  await inventoryPage.getCartBadgeCount();

  await cartPage.continueShopping();
  // Add another item to cart and verify badge count
  const itemName3 = await inventoryPage.addItemToCart(3);
  addedItems.push(itemName3);
  await inventoryPage.getCartBadgeCount();

  // Proceed to checkout and verify that the checkout contains the correct item
  await cartPage.goto();
  const cartItemNames = await cartPage.getCartItemNames();
  await cartPage.proceedToCheckout();
  await checkoutPage.fillCheckoutForm("TestName", "TestLastname", "0000");

  // Extract item names on checkout overview page
  const checkoutItemNames = await checkoutPage.getCheckoutItemNames();
  console.log("Added items:", cartItemNames);
  console.log("Items in checkout:", checkoutItemNames);

  // Verify that the checkout items match the added items
  expect(addedItems).toEqual(checkoutItemNames);

  //verify that the checkout was successful and the order was completed
  await checkoutPage.finishOrder();
  console.log("Order completed successfully.");
});
