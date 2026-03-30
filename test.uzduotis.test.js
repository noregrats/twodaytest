import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  // Extract username from the "Accepted usernames are:" section
  const usernames = await page.evaluate(() => {
    const text = document.body.innerText;
    const match = text.match(/Accepted usernames are:\s*([\w_]+)/);
    return match ? match[1] : "standard_user";
  });
  await page.locator('[data-test="username"]').fill(usernames);

  // Extract password from the "Password for all users:" section
  const password = await page.evaluate(() => {
    const text = document.body.innerText;
    const match = text.match(/Password for all users:\s*([\w_]+)/);
    return match ? match[1] : "secret_sauce";
  });

  await page.locator('[data-test="password"]').fill(password);
  console.log(
    `Logging in with username: ${usernames} and password: ${password}`,
  );

  //Verify that only 6 inventory items are displayed on the page
  await page.locator('[data-test="login-button"]').click();
  await page
    .locator('[data-test="inventory-item-description"]')
    .count()
    .then((count) => {
      console.log(`Found ${count} inventory items.`);
      if (count != 6) {
        throw new Error(`Expected 6 inventory items, but found ${count}`);
      }
    });

  // Add the first item to the cart and save its name for later verification
  const itemLink = page.locator('[data-test="item-4-title-link"]');
  await expect(itemLink).toBeVisible({ timeout: 5000 });
  const itemName = await itemLink.textContent();
  console.log(`Adding item to cart: ${itemName}`);
  await itemLink.click();
  await page.locator('[data-test="add-to-cart"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");

  //verify that the cart contains the item that was added
  await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText(
    itemName,
  );
  console.log(`Verified that the cart contains the item: ${itemName}`);

  //verify that the cart badge shows the correct number of items in the cart
  const cartBadge = page.locator('[data-test="shopping-cart-link"] span');
  const cartItems = page.locator('[data-test="item-4-title-link"]');
  const itemsCount = await cartItems.count();
  const badgeText = await cartBadge.textContent();

  expect(String(itemsCount)).toBe(badgeText.trim());
  console.log(
    `Cart badge shows ${badgeText} and contains ${itemsCount} items as expected.`,
  );

  // Proceed to checkout and verify that the checkout contains the correct item
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill("TestName");
  await page.locator('[data-test="lastName"]').fill("TestLastname");
  await page.locator('[data-test="postalCode"]').fill("0000");
  await page.locator('[data-test="continue"]').click();
  await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText(
    itemName,
  );

  //verify that the checkout was successful and the order was completed
  console.log(`Verified that the checkout contains the item: ${itemName}`);
  await page.locator('[data-test="finish"]').click();
  await expect(page.locator(".complete-header")).toHaveText(
    "Thank you for your order!",
  );
  console.log("Order completed successfully.");
});
