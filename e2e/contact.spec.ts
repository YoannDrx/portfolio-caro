import { expect, test } from '@playwright/test'

test.describe('Contact Page', () => {
  test('should load contact page successfully', async ({ page }) => {
    await page.goto('/fr/contact')

    // Check that the page loads
    await expect(page.locator('h1')).toContainText(/contact/i)
  })

  test('should display contact form', async ({ page }) => {
    await page.goto('/fr/contact')

    // Check for form elements
    const nameInput = page.locator('input[name="name"], input[id*="name"]').first()
    const emailInput = page.locator('input[type="email"]').first()
    const messageInput = page.locator('textarea').first()

    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(messageInput).toBeVisible()
  })

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/fr/contact')

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]').first()
    await submitButton.click()

    await expect(page.locator('form [role="alert"]')).toContainText(/vérifiez/i)
    await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true')
  })
})
