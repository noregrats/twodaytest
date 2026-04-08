import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { InventoryPage } from "./pages/InventoryPage.js";
import { CartPage } from "./pages/CartPage.js";

async function getLocalStorageSnapshot(page) {
  return page.evaluate(() => {
    const snapshot = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        snapshot[key] = window.localStorage.getItem(key);
      }
    }
    return snapshot;
  });
}

test("cart persistence across logout/login in same context", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.goto();

  await loginPage.login("standard_user", "secret_sauce");
  await inventoryPage.addItemToCart(0);
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(
    "1",
  );

  const cartContentsBeforeLogout = await page.evaluate(() =>
    window.localStorage.getItem("cart-contents"),
  );
  const localStorageBeforeLogout = await getLocalStorageSnapshot(page);
  console.log(
    "LocalStorage before logout:",
    JSON.stringify(localStorageBeforeLogout, null, 2),
  );
  console.log("cart-contents before logout:", cartContentsBeforeLogout);

  await loginPage.logoutAndVerifyLoginPage();

  await loginPage.login("visual_user", "secret_sauce");
  await expect(page).toHaveURL(/inventory.html/);

  const cartContentsAfterRelogin = await page.evaluate(() =>
    window.localStorage.getItem("cart-contents"),
  );
  const localStorageAfterRelogin = await getLocalStorageSnapshot(page);
  console.log(
    "LocalStorage after visual_user login:",
    JSON.stringify(localStorageAfterRelogin, null, 2),
  );
  console.log(
    "cart-contents after visual_user login:",
    cartContentsAfterRelogin,
  );
  expect(cartContentsAfterRelogin).toBe(cartContentsBeforeLogout);

  const visualUserBadge = await inventoryPage.getCartBadgeCount();
  expect(visualUserBadge).toBe(1);
  console.log(`Cart badge after visual_user login: ${visualUserBadge}`);
  console.log(
    "Characterization: cart persisted across logout/login in same browser context",
  );

  await cartPage.goto();
  await expect(page).toHaveURL(/cart.html/);
});
