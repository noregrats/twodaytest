export class CartPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }

  async removeFirstItem() {
    const itemName = await this.page
      .locator('[data-test="inventory-item-name"]')
      .first()
      .textContent();
    await this.page.locator('button[data-test^="remove-"]').first().click();
    console.log(`Removed item from cart: ${itemName?.trim()}`);
    return itemName?.trim();
  }

  async continueShopping() {
    await this.page.locator('[data-test="continue-shopping"]').click();
  }

  async proceedToCheckout() {
    await this.page.locator('[data-test="checkout"]').click();
  }

  getCartItemNames() {
    return this.page
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
  }
}
