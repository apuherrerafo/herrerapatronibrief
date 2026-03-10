// @ts-check
// Tester E2E para H&P Brief. Ejecutar: npm run test (arranca el servidor si no está)
// El login en index.html (video/overlay) no se prueba aquí; el flujo completo se valida en admin.html y manualmente en index.
const { test, expect } = require('@playwright/test');

test.setTimeout(20000);

test.describe('Index — Carga', () => {
  test('index carga y muestra formulario de login', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('#loginInput')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#loginBtn')).toBeVisible();
  });

  test('index #admin carga y muestra formulario de login admin', async ({ page }) => {
    await page.goto('/#admin', { waitUntil: 'load' });
    await expect(page.locator('#loginInput')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#loginBtn')).toBeVisible();
  });
});

test.describe('Admin.html — Login y lista', () => {
  test('login con cafeteria muestra panel y rejilla', async ({ page }) => {
    await page.goto('/admin.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#loginInput', { state: 'visible', timeout: 10000 });
    await page.locator('#loginInput').fill('cafeteria');
    await page.locator('button:has-text("Ingresar")').click();
    await expect(page.locator('#mainApp')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#usersGrid')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.user-card')).toHaveCount(3, { timeout: 5000 });
  });
});
