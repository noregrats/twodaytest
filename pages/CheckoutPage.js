export class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.locator('[data-test="checkout"]').click();
  }

  async fillCheckoutForm(firstName, lastName, postalCode) {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    await this.page.locator('[data-test="continue"]').click();
    console.log("Filled checkout form and continued");
  }

  async tryCheckoutWithEmptyFieldsAndConfirmError(
    expectedMessage = "Error: First Name is required",
  ) {
    await this.page.locator('[data-test="firstName"]').fill("");
    await this.page.locator('[data-test="lastName"]').fill("");
    await this.page.locator('[data-test="postalCode"]').fill("");
    await this.page.locator('[data-test="continue"]').click();

    const actualError =
      (await this.page.locator('[data-test="error"]').textContent())?.trim() ??
      "";
    console.log(`Actual error message: "${actualError}"`);
    return actualError === expectedMessage;
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
    const confirmationText =
      (await this.page.locator(".complete-header").textContent())?.trim() ?? "";
    console.log(`Order confirmation success: ${confirmationText}`);
    return confirmationText;
  }
}
