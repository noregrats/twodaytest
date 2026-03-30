import { chromium } from "playwright";
import pkg from "playwright-stealth";
const { stealth } = pkg;

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  await stealth.chromium.use(context);
  const page = await context.newPage();
  await page.goto("https://demo.nopcommerce.com/");
  await page.pause();
})();
