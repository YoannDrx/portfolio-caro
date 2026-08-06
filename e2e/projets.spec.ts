import { expect, test } from '@playwright/test'

type ProjectApiResult = {
  items: unknown[]
  total: number
  page: number
  pageSize: number
  pageCount: number
  facets: Record<string, unknown>
}

test.describe('Projets Page', () => {
  test('should load projets page successfully', async ({ page }) => {
    await page.goto('/fr/projets')

    // A cold production server can briefly retain the previous React tree while
    // hydrating. Wait for the page landmark to settle before asserting content.
    const heading = page.getByRole('heading', { level: 1, name: /projets/i })
    await expect(heading).toHaveCount(1)
    await expect(heading).toBeVisible()

    // Check for breadcrumb
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible()
  })

  test('should display projets grid', async ({ page }) => {
    await page.goto('/fr/projets')

    // Should have project cards
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 15000 })
    const projectCards = page.locator('[data-testid="project-card"]')
    await expect(projectCards.first()).toBeVisible()
    expect(await projectCards.count()).toBeLessThanOrEqual(24)
  })

  test('should expose a paginated API contract', async ({ request }) => {
    const response = await request.get('/api/projets?locale=fr&page=1&pageSize=24')
    expect(response.ok()).toBeTruthy()

    const result = (await response.json()) as unknown as ProjectApiResult
    expect(result.items.length).toBeLessThanOrEqual(24)
    expect(result.total).toBeGreaterThan(result.items.length)
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(24)
    expect(result.pageCount).toBeGreaterThan(1)
    expect(result.facets).toBeTruthy()
  })

  test('should persist the professional list view in the URL', async ({ page }) => {
    await page.goto('/fr/projets')
    await page.getByRole('button', { name: 'Liste' }).click()

    await expect(page).toHaveURL(/view=list/)
    await expect(page.getByRole('button', { name: 'Liste' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  test('should filter projets by category', async ({ page }) => {
    await page.goto('/fr/projets')

    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 15000 })

    // Click on a category filter button (not "Tout")
    const filterButtons = page
      .locator('[data-testid="category-filter"]')
      .filter({ hasNotText: 'Tout' })
    if ((await filterButtons.count()) > 0) {
      await filterButtons.first().click()

      // Projects should still be visible
      await expect(page.locator('[data-testid="project-card"]').first()).toBeVisible()
    }
  })

  test('should search for a project', async ({ page }) => {
    await page.goto('/fr/projets')

    // Find search input
    const filters = page.getByRole('region', { name: 'Filtres du catalogue' })
    await expect(filters).toHaveCount(1)
    const searchInput = filters.getByTestId('projects-search')
    await expect(searchInput).toHaveCount(1)
    await searchInput.fill('minimal')

    // Should show results for seeded data
    await expect(page.locator('[data-testid="project-card"]').first()).toBeVisible()
  })

  test('should navigate to project detail', async ({ page }) => {
    await page.goto('/fr/projets')

    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 15000 })

    // Click on first project
    const firstProject = page.locator('[data-testid="project-card"]').first()
    await firstProject.click()

    // Should navigate to detail page
    await expect(page).toHaveURL(/\/fr\/projets\/[^/?]+\?returnTo=/)
  })
})
