import { test, expect } from '@playwright/test';

test.describe('Het Albert Heijn logo navigeert naar de homepagina', {
  tag: '@case',
  annotation: {
    type: 'description',
    description: 'Het Albert Heijn logo in de navigatiebalk is een link naar de homepagina.',
  },
}, () => {
  test('het logo is een link naar de homepagina', async ({ page }) => {
    test.setTimeout(20_000);

    await test.step('Open de Albert Heijn website', async () => {
      await page.goto('/');
    });

    await test.step('Controleer dat het logo linkt naar de homepagina', async () => {
      // data-testid="nav-logo" is present twice (regular + compact sticky header);
      // both should link to "/".
      await expect(page.getByTestId('nav-logo').first()).toHaveAttribute('href', '/', { timeout: 15_000 });
    });
  });
});
