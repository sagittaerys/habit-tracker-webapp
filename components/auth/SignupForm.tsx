'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsers, saveUsers, saveSession } from '@/lib/storage'

export default function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const users = getUsers()
    const exists = users.find((u) => u.email === email)

    if (exists) {
      setError('User already exists')
      setLoading(false)
      return
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      createdAt: new Date().toISOString(),
    }

    saveUsers([...users, newUser])
    saveSession({ userId: newUser.id, email: newUser.email })
    router.replace('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {error && (
        <div
          className="text-sm px-4 py-3 rounded-lg border"
          style={{
            color: '#ff6b6b',
            borderColor: '#ff6b6b33',
            background: '#ff6b6b11',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          data-testid="auth-signup-email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-lg text-white text-sm transition-colors"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          data-testid="auth-signup-password"
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-lg text-white text-sm transition-colors"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        data-testid="auth-signup-submit"
        className="w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-opacity disabled:opacity-50"
        style={{
          background: 'var(--accent)',
          color: '#000',
          fontFamily: 'var(--font-syne)',
        }}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}