import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { InventoryPage } from "./pages/InventoryPage.js";

test("sorting items in inventory", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");
  await inventoryPage.waitForInventoryLoad();
  await inventoryPage.addItemToCart(1);
  await inventoryPage.getCartBadgeCount();

  const newContext = await page.context().browser().newContext();
  const newPage = await newContext.newPage();
  const newLoginPage = new LoginPage(newPage);
  const newInventoryPage = new InventoryPage(newPage);

  await newLoginPage.goto();
  await newLoginPage.login("problem_user", "secret_sauce");
  await newInventoryPage.getCartBadgeCount();
  await newContext.close();
});
