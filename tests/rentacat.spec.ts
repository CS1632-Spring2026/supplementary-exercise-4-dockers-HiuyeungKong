import { test, expect } from '@playwright/test';

// TODO: Fill in with test cases.
const baseUrl = 'http://localhost:8080';

async function setCookies(
  page: import('@playwright/test').Page,
  cat1: boolean,
  cat2: boolean,
  cat3: boolean
) {
  await page.goto(baseUrl);

  await page.evaluate(
    ({ v1, v2, v3 }) => {
      document.cookie = `1=${v1}`;
      document.cookie = `2=${v2}`;
      document.cookie = `3=${v3}`;
    },
    {
      v1: cat1 && 'true' || 'false',
      v2: cat2 && 'true' || 'false',
      v3: cat3 && 'true' || 'false',
    }
  );
}

test('TEST-1-RESET', async ({ page }) => {
  await setCookies(page, true, true, true);
  await page.getByRole('link', { name: 'Reset' }).click();

  const items = page.locator('#listing li');
  await expect(items.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(items.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(items.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
  await setCookies(page, false, false, false);
  await page.getByRole('link', { name: 'Catalog' }).click();

  const secondImg = page.locator('ol li img').nth(1);
  await expect(secondImg).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
  await setCookies(page, false, false, false);
  await page.getByRole('link', { name: 'Catalog' }).click();

  const listing = page.locator('#listing li');
  await expect(listing).toHaveCount(3);
  await expect(listing.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
  await setCookies(page, false, false, false);
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

  await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
  await setCookies(page, false, false, false);
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await page.getByTestId('rentID').fill('1');
  await page.getByRole('button', { name: 'Rent' }).click();

  const listing = page.locator('#listing li');
  await expect(listing.nth(0)).toHaveText('Rented out');
  await expect(listing.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(listing.nth(2)).toHaveText('ID 3. Mistoffelees');
  await expect(page.getByTestId('rentResult')).toHaveText('Success!');
});

test('TEST-6-RETURN', async ({ page }) => {
  await setCookies(page, false, true, true);
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await page.getByTestId('returnID').fill('2');
  await page.getByRole('button', { name: 'Return' }).click();

  const listing = page.locator('#listing li');
  await expect(listing.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(listing.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(listing.nth(2)).toHaveText('Rented out');
  await expect(page.getByTestId('returnResult')).toHaveText('Success!');
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
  await setCookies(page, false, false, false);
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

  await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
  await setCookies(page, false, false, false);
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
  await page.getByTestId('catnips').fill('6');
  await page.getByRole('button', { name: 'Feed' }).click();

  await expect(page.getByTestId('feedResult')).toHaveText('Nom, nom, nom.', { timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
  await setCookies(page, false, false, false);
  await page.getByRole('link', { name: 'Greet-A-Cat' }).click();

  await expect(page.getByTestId('greeting')).toContainText('Meow!Meow!Meow!');
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  await setCookies(page, false, false, false);
  await page.goto(`${baseUrl}/greet-a-cat/Jennyanydots`);

  await expect(page.getByTestId('greeting')).toContainText('Meow! from Jennyanydots.');
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
  await setCookies(page, true, true, true);
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

  await expect(page.locator('body')).toHaveScreenshot();
});