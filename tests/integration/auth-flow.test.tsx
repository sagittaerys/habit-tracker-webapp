import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}))

import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import { saveUsers, saveSession } from '@/lib/storage'

beforeEach(() => {
  localStorage.clear()
})

describe('auth flow', () => {
  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'password123')
    await user.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null')
      expect(session).not.toBeNull()
      expect(session.email).toBe('test@example.com')
    })
  })

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup()
    saveUsers([{
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
    }])

    render(<SignupForm />)

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'password123')
    await user.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument()
    })
  })

  it('submits the login form and stores the active session', async () => {
    const user = userEvent.setup()
    saveUsers([{
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
    }])

    render(<LoginForm />)

    await user.type(screen.getByTestId('auth-login-email'), 'test@example.com')
    await user.type(screen.getByTestId('auth-login-password'), 'password123')
    await user.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null')
      expect(session).not.toBeNull()
      expect(session.userId).toBe('1')
    })
  })

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByTestId('auth-login-email'), 'wrong@example.com')
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpassword')
    await user.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })
  })
})