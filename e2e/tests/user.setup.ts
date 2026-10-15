import {test as setup, expect} from '@playwright/test'

const file = 'playwright/.auth/user.json'

setup('auth user', async ({page}) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Connexion' }).click();
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').fill('client@eventflow.test');
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').fill('client1234');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByRole("link", {name: 'mes billets'})).toBeVisible()
    await page.context().storageState({path: file})
})