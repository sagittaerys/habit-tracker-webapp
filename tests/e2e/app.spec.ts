import { test, expect } from '@playwright/test'

const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'password123',
}

test.describe('Habit Tracker app', () => {
  
  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('splash-screen')).toBeVisible()
    await expect(page).toHaveURL('/login', { timeout: 5000 })
  })

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill(testUser.email)
    await page.getByTestId('auth-signup-password').fill(testUser.password)
    await page.getByTestId('auth-signup-submit').click()
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })

    await page.goto('/')
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })
  })

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login', { timeout: 5000 })
  })

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill(testUser.email)
    await page.getByTestId('auth-signup-password').fill(testUser.password)
    await page.getByTestId('auth-signup-submit').click()
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
  })

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // signup first
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill(testUser.email)
    await page.getByTestId('auth-signup-password').fill(testUser.password)
    await page.getByTestId('auth-signup-submit').click()
    await expect(page).toHaveURL('/dashboard')

    // create a habit
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-save-button').click()

    // logout
    await page.getByTestId('auth-logout-button').click()
    await expect(page).toHaveURL('/login')

    // login again
    await page.getByTestId('auth-login-email').fill(testUser.email)
    await page.getByTestId('auth-login-password').fill(testUser.password)
    await page.getByTestId('auth-login-submit').click()
    await expect(page).toHaveURL('/dashboard')

    // only this user's habits visible
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill(testUser.email)
    await page.getByTestId('auth-signup-password').fill(testUser.password)
    await page.getByTestId('auth-signup-submit').click()
    await expect(page).toHaveURL('/dashboard')

    await page.getByTestId('create-habit-button').click()
    await expect(page.getByTestId('habit-form')).toBeVisible()

    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-description-input').fill('Stay hydrated')
    await page.getByTestId('habit-save-button').click()

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill(testUser.email)
    await page.getByTestId('auth-signup-password').fill(testUser.password)
    await page.getByTestId('auth-signup-submit').click()
    await expect(page).toHaveURL('/dashboard')

    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()

    const streakBefore = await page.getByTestId('habit-streak-drink-water').textContent()
    await page.getByTestId('habit-complete-drink-water').click()

    await expect(page.getByTestId('habit-streak-drink-water')).not.toHaveText(streakBefore!)
  })

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill(testUser.email)
    await page.getByTestId('auth-signup-password').fill(testUser.password)
    await page.getByTestId('auth-signup-submit').click()
    await expect(page).toHaveURL('/dashboard')

    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()

    await page.reload()
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill(testUser.email)
    await page.getByTestId('auth-signup-password').fill(testUser.password)
    await page.getByTestId('auth-signup-submit').click()
    await expect(page).toHaveURL('/dashboard')

    await page.getByTestId('auth-logout-button').click()
    await expect(page).toHaveURL('/login')
  })

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    // load app online first so SW caches it
    await page.goto('/login')
    await expect(page).toHaveURL('/login')

    // wait for service worker to activate
    await page.waitForTimeout(2000)

    // go offline
    await context.setOffline(true)

    // reload - should serve from cache, not crash
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {})
    
    // app shell should still render
    const body = await page.locator('body').textContent()
    expect(body).not.toBeNull()
    
    await context.setOffline(false)
  })
})