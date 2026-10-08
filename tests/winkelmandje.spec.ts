import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';
const PRODUCT_NAME = 'Sauce Labs Backpack';

test.describe('Een product toevoegen aan het winkelmandje', {
  tag: '@case',
  annotation: {
    type: 'description',
    description: 'Een gebruiker logt in op de webshop, voegt een product toe aan het winkelmandje en ziet dat de teller in de navigatie wordt bijgewerkt.',
  },
}, () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('voegt een product toe aan het winkelmandje', async ({ page }) => {
    await test.step('Klik op "Toevoegen aan winkelmandje" voor de Sauce Labs Backpack', async () => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    });

    await test.step('Controleer dat de winkelmandje-teller op 1 staat', async () => {
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    });
  });

  test('het juiste product zit in het winkelmandje', async ({ page }) => {
    await test.step('Voeg de Sauce Labs Backpack toe aan het winkelmandje', async () => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    });

    await test.step('Open het winkelmandje', async () => {
      await page.locator('[data-test="shopping-cart-link"]').click();
      await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
    });

    await test.step('Controleer dat de Sauce Labs Backpack in het winkelmandje staat', async () => {
      await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(PRODUCT_NAME);
    });
  });
});
