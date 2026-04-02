export class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async fillCheckoutForm(firstName, lastName, postalCode) {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    await this.page.locator('[data-test="continue"]').click();
    console.log("Filled checkout form and continued");
  }

  async getCheckoutItemNames() {
    return await this.page
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
  }

  async finishOrder() {
    await this.page.locator('[data-test="finish"]').click();
  }

  async getOrderConfirmation() {
    return await this.page.locator(".complete-header").textContent();
  }
}
