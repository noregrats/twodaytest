import { test, expect } from '@playwright/test';

test('capture dynamic value', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/dynamic-table');

  // target the cell with dynamic text, maybe needs locator adjust
  const locator = page.locator('text=Chrome CPU:').first();

  // get captured text
  const actual = await locator.textContent();

  console.log('captured value:', actual);

  // optional assertion
  expect(actual).toContain('Chrome CPU:');

  // return from helper function example
  // (Playwright test function itself cannot `return` to external caller,
  // do this in a helper if needed)
  return actual;
});



test('test2', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/radio-buttons');

  await page.getByRole('radio', { name: 'Football' }).check();
  await page.getByRole('radio', { name: 'Black' }).check();
  await page.getByRole('radio', { name: 'Red' }).check();
});

test('test3', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/drag-and-drop');
  await page.locator('#column-a').hover();
  await page.mouse.down();
  await page.locator('#column-b').hover();
  await page.mouse.up();

});


test('test', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/notification-message-rendered');
  await page.getByRole('link', { name: 'Click here' }).click();
  await page.getByRole('link', { name: 'Click here' }).click();
 // await page.locator('iframe[name="aswift_4"]').contentFrame().getByRole('button', { name: 'Close ad' }).click();
  await page.getByText('Action successful', { exact: true }).click();
});

