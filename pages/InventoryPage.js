import { expect } from "@playwright/test";

export class InventoryPage {
  constructor(page) {
    this.page = page;
  }

  async waitForInventoryLoad() {
    await this.page.waitForSelector(".inventory_item", { state: "visible" });
  }

  async sortBy(option) {
    const sortSelector =
      (await this.page.$('select[data-test="product_sort_container"]')) !== null
        ? 'select[data-test="product_sort_container"]'
        : 'select[data-test="product-sort-container"]';

    await this.page.waitForSelector(sortSelector, { state: "visible" });
    await this.page.selectOption(sortSelector, option);
    await this.page.waitForTimeout(500);
  }

  getItems() {
    return this.page.locator(".inventory_item");
  }

  async getItemPrice(index) {
    const items = this.getItems();
    const priceText = await items
      .nth(index)
      .locator(".inventory_item_price")
      .textContent();
    return priceText?.trim() ?? "";
  }

  async pricecheckLowHigh() {
    const firstPriceText = await this.getItemPrice(0);
    const secondPriceText = await this.getItemPrice(1);

    const firstPriceInt = Math.round(
      Number(firstPriceText.replace(/[^0-9.]/g, "")),
    );
    const secondPriceInt = Math.round(
      Number(secondPriceText.replace(/[^0-9.]/g, "")),
    );

    expect(Number.isFinite(firstPriceInt)).toBe(true);
    expect(Number.isFinite(secondPriceInt)).toBe(true);

    console.log(
      "firstPriceInt:",
      firstPriceInt,
      "secondPriceInt:",
      secondPriceInt,
    );

    return { firstPriceInt, secondPriceInt };
  }

  async addItemToCart(index) {
    const itemName = await this.getItems()
      .nth(index)
      .locator(".inventory_item_name")
      .textContent();
    await this.getItems().nth(index).locator("button.btn_inventory").click();
    console.log(`Added item ${index} to cart: ${itemName?.trim()}`);
    return itemName?.trim();
  }

  async verifyFirstItemFieldsAndAddToCart() {
    await expect(
      this.page.locator('[data-test="inventory-item-name"]').first(),
    ).toHaveText(/\S+/);
    console.log("Verified that the first item has a non-empty name.");

    await expect(
      this.page.locator('[data-test="inventory-item-desc"]').first(),
    ).toHaveText(/\S+/);
    console.log("Verified that the first item has a non-empty description.");

    await expect(
      this.page.locator('[data-test="inventory-item-price"]').first(),
    ).toHaveText(/\S+/);
    console.log("Verified that the first item has a non-empty price.");

    const itemName =
      (await this.page
        .locator('[data-test="inventory-item-name"]')
        .first()
        .textContent()) ?? "";

    await this.page
      .locator('button[data-test^="add-to-cart-"]')
      .first()
      .click();
    console.log(`Added item to cart: ${itemName}`);

    return itemName;
  }

  async getCartBadgeCount() {
    await this.page.waitForSelector('[data-test="shopping-cart-link"] span', {
      timeout: 5000,
    });
    const badgeText = await this.page
      .locator('[data-test="shopping-cart-link"] span')
      .textContent();
    console.log("Current cart badge count:", badgeText);
    return badgeText ? parseInt(badgeText.trim(), 10) : 0;
  }
}
