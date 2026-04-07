import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { InventoryPage } from "./pages/InventoryPage.js";

test("test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.autoLoginUser2();
});
