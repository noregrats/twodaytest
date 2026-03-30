import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://pronailshop.co.uk/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Shop' }).nth(2).click();
  const page1 = await page1Promise;
  await page1.getByRole('link', { name: 'White Nail Art Gel French SI' }).click();
  await page1.getByRole('button', { name: '+' }).click();
  await page1.getByRole('button', { name: 'Add to bag' }).click();
  await page1.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
});



test('test2', async ({ page }) => {
  await page.goto('https://pronailshop.co.uk/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Shop' }).nth(2).click();
  const page1 = await page1Promise;
  await page1.getByRole('link', { name: 'SAUTE NAILS' }).click();
  await page1.getByRole('link', { name: 'FIBER BASE - ERROR 13 ML' }).click();
  await page1.getByRole('button', { name: '+' }).click();
  await page1.getByRole('button', { name: '-' }).click();
});