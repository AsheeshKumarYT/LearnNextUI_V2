// Smoke tests for every portal: sign in with the demo account, pick the role, open each of its pages and check none
// crashes, shows "not found" or logs an error. Run: npm test
import { expect, test } from '@playwright/test';

const TRAINING_PARTNER_PAGES = [
  '/dashboard',
  '/clients',
  '/clients/new',
  '/clients/cl-1',
  '/clients/cl-1?tab=projects',
  '/clients/cl-1?tab=participants',
  '/clients/cl-1?tab=spocs',
  '/clients/cl-1?tab=billing',
  '/clients/cl-1?tab=settings',
  '/clients/cl-1?tab=activity',
  '/clients/cl-1/edit',
  '/content',
  '/content/prg-1',
  '/facilitators',
  '/support',
  '/settings',
  '/settings/entity',
  '/settings/sub-entity',
  '/settings/sap-bp',
  '/settings/expense-head',
  '/settings/country',
  '/settings/state',
  '/settings/city',
  '/settings/department',
  '/settings/designation',
  '/settings/role',
  '/settings/industry-type',
  '/settings/program-category',
  '/settings/modules',
  '/settings/menu-mapping-access',
  '/settings/roles-access',
  '/projects',
  '/finance/invoices',
  '/reports',
  '/profile',
];

const SUPER_ADMIN_PAGES = [
  '/clients',
  '/clients/new',
  '/clients/tp-1',
  '/clients/tp-1?tab=sub-clients',
  '/clients/tp-1?tab=billing',
  '/clients/tp-1?tab=settings',
  '/clients/tp-1?tab=activity',
  '/clients/tp-1/edit',
  '/profile',
];

/** Sign in with the demo account and continue as `role` (the role picker's value) */
async function signIn(page, role) {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Use demo' }).click();
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.waitForURL('**/choose-role');
  await page.locator(`input[name="role"][value="${role}"]`).check({ force: true });
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL((url) => !url.pathname.startsWith('/choose-role'));
}

/** Opens each path; fails on a crash / not-found screen or any console error or uncaught exception */
async function visitAll(page, paths) {
  const problems = [];
  page.on('pageerror', (e) => problems.push(`uncaught: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
  for (const path of paths) {
    await page.goto(path);
    await page.locator('main').first().waitFor();
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    expect.soft(title, `${path} shows an error screen`).not.toMatch(/Something went wrong|Page not found|Client not found/);
  }
  expect(problems, problems.join('\n')).toEqual([]);
}

test('sign-in page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Sign in to LearnNext' })).toBeVisible();
});

test('Training Partner: every page opens', async ({ page }) => {
  await signIn(page, 'admin');
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('aside').getByText('Training Partner')).toBeVisible();
  await visitAll(page, TRAINING_PARTNER_PAGES);
});

test('Super Admin: only Manage Clients and My Profile, every page opens', async ({ page }) => {
  await signIn(page, 'super-admin');
  await expect(page).toHaveURL(/\/clients$/);
  const menu = page.locator('aside nav a');
  await expect(menu).toHaveCount(1);
  await expect(menu.first()).toHaveText('Manage Clients');
  // Pages outside its menu send it back to Manage Clients
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/clients$/);
  await visitAll(page, SUPER_ADMIN_PAGES);
});
