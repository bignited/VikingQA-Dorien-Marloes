import { test, expect } from '@playwright/test';

// Zet de browsertaal op nl-BE zodat Coolblue altijd de Nederlandse versie toont
test.use({ locale: 'nl-BE' });

const PRODUCT_URL =
  'https://www.coolblue.be/nl/product/966788/acer-chromebook-plus-514-cb514-6ht-39rp-azerty.html';

// De € wordt via CSS gerenderd; de DOM-teksten zijn zonder €-teken
const ORIGINAL_PRICE = '439,-';
const DISCOUNTED_PRICE = '379,-';
const DISCOUNT_LABEL = '-14%';

async function acceptCookies(page: import('@playwright/test').Page) {
  const btn = page.locator('[name="accept_cookie"]');
  try {
    await btn.waitFor({ state: 'visible', timeout: 10_000 });
    await btn.click();
    await btn.waitFor({ state: 'hidden', timeout: 5_000 });
  } catch {
    // Cookie dialog niet aanwezig of al geaccepteerd
  }
}

test.describe('Korting wordt correct toegepast bij het afrekenen', {
  tag: '@case',
  annotation: {
    type: 'description',
    description:
      'Een klant bekijkt een promotieproduct (Acer Chromebook Plus 514) en controleert dat de kortingsprijs (379,-), de originele prijs (439,-) en het kortingspercentage (-14%) correct zichtbaar zijn op de productpagina — zowel in het bovenste aankoopblok als in het "Dit wordt \'m"-blok onderaan.',
  },
}, () => {

  test('toont de korting correct op de productpagina en in het aankoopblok', async ({ page }) => {
    await test.step('Navigeer naar de productpagina en accepteer cookies', async () => {
      await page.goto(PRODUCT_URL);
      await expect(page).toHaveTitle(/Acer Chromebook/, { timeout: 20_000 });
      await acceptCookies(page);
    });

    await test.step('Controleer dat de kortingsprijs zichtbaar is', async () => {
      await expect(page.getByText(DISCOUNTED_PRICE, { exact: true }).first()).toBeVisible({ timeout: 15_000 });
    });

    await test.step('Controleer dat de oorspronkelijke (hogere) prijs zichtbaar is', async () => {
      await expect(page.getByText(ORIGINAL_PRICE, { exact: true }).first()).toBeVisible();
    });

    await test.step('Controleer dat het kortingspercentage zichtbaar is', async () => {
      await expect(page.getByText(DISCOUNT_LABEL, { exact: true }).first()).toBeVisible();
    });

    await test.step('Controleer dat de korting ook in het "Dit wordt \'m"-blok onderaan staat', async () => {
      // Het blok "Dit wordt 'm" herhaalt de prijs + korting onderaan de pagina
      await expect(page.getByText(DISCOUNTED_PRICE, { exact: true }).last()).toBeVisible();
      await expect(page.getByText(ORIGINAL_PRICE, { exact: true }).last()).toBeVisible();
      await expect(page.getByText(DISCOUNT_LABEL, { exact: true }).last()).toBeVisible();
    });

    await test.step('Controleer dat de aankoopknop naast de kortingsprijs actief is', async () => {
      // De knop "In mijn winkelwagen" moet enabled zijn — dit bevestigt dat het product bestelbaar is
      await expect(
        page.getByRole('button', { name: 'In mijn winkelwagen' }).first()
      ).toBeEnabled();
    });
  });
});
