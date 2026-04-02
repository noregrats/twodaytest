import { test, expect } from "@playwright/test";

test("saucedemo first two prices as integers", async ({ page }) => {
  const addedItems = []; // 👈 Declare array to store added item names
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

  //pasitikrint
  const sortSelector =
    (await page.$('select[data-test="product_sort_container"]')) !== null
      ? 'select[data-test="product_sort_container"]'
      : 'select[data-test="product-sort-container"]';

  await page.waitForSelector(sortSelector, { state: "visible" });
  await page.selectOption(sortSelector, "lohi");
  await page.waitForTimeout(500);

  //iskelt atskirai
  const items = page.locator(".inventory_item");
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

  // Add two items to the cart and verify the cart badge count
  const itemName0 = await page
    .locator(".inventory_item")
    .nth(0)
    .locator(".inventory_item_name")
    .textContent();
  addedItems.push(itemName0?.trim());
  await page
    .locator(".inventory_item")
    .nth(0)
    .locator("button.btn_inventory")
    .click();
  console.log("Added first item to cart");
  expect(await badgeCheck()).toBe(1);
  // Add second item to cart and verify badge count
  const itemName1 = await page
    .locator(".inventory_item")
    .nth(1)
    .locator(".inventory_item_name")
    .textContent();
  addedItems.push(itemName1?.trim());
  await page
    .locator(".inventory_item")
    .nth(1)
    .locator("button.btn_inventory")
    .click();
  expect(await badgeCheck()).toBe(2);
  console.log("Added second item to cart");
  //  Add third item to cart and verify badge count
  const itemName2 = await page
    .locator(".inventory_item")
    .nth(2)
    .locator(".inventory_item_name")
    .textContent();
  addedItems.push(itemName2?.trim());
  await page
    .locator(".inventory_item")
    .nth(2)
    .locator("button.btn_inventory")
    .click();
  expect(await badgeCheck()).toBe(3);
  console.log("Added third item to cart");
  // Remove one item from cart and verify badge count
  await badgeCheck();
  const removedItem = await page
    .locator(".inventory_item")
    .nth(0)
    .locator(".inventory_item_name")
    .textContent();
  addedItems.splice(addedItems.indexOf(removedItem?.trim()), 1);
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('button[data-test^="remove-"]').first().click();
  console.log("Removed one item from cart");
  await badgeCheck();

  await page.locator('[data-test="continue-shopping"]').click();
  const itemName3 = await page
    .locator(".inventory_item")
    .nth(3)
    .locator(".inventory_item_name")
    .textContent();
  addedItems.push(itemName3?.trim());
  await page
    .locator(".inventory_item")
    .nth(3)
    .locator("button.btn_inventory")
    .click();
  console.log("Added third item to cart");
  await badgeCheck();

  // Proceed to checkout and verify that the checkout contains the correct item
  await page.locator('[data-test="shopping-cart-link"]').click();
  const cartItemNames = await page
    .locator('[data-test="inventory-item-name"]')
    .allTextContents();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill("TestName");
  await page.locator('[data-test="lastName"]').fill("TestLastname");
  await page.locator('[data-test="postalCode"]').fill("0000");
  await page.locator('[data-test="continue"]').click();
  console.log("Proceeded to checkout");

  // Extract item names on checkout overview page
  const checkoutItemNames = await page
    .locator('[data-test="inventory-item-name"]')
    .allTextContents();
  console.log("Added items:", cartItemNames);
  console.log("Items in checkout:", checkoutItemNames);

  // Verify that the checkout items match the added items
  expect(addedItems).toEqual(checkoutItemNames);

  //verify that the checkout was successful and the order was completed

  await page.locator('[data-test="finish"]').click();
  await expect(page.locator(".complete-header")).toHaveText(
    "Thank you for your order!",
  );
  console.log("Order completed successfully.");

  //function to check that the cart badge shows the correct number of items in the cart
  async function badgeCheck() {
    await page.waitForSelector('[data-test="shopping-cart-link"] span', {
      timeout: 5000,
    });
    const badgeText = await page
      .locator('[data-test="shopping-cart-link"] span')
      .textContent();
    console.log("Current cart badge count:", badgeText);
    return badgeText ? parseInt(badgeText.trim(), 10) : 0;
  }
});
