import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-sm flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <div
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
          >
            Habit Tracker
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Log in to continue your streak
          </p>
        </div>

        <LoginForm />

        <p
          className="text-sm text-center"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          No account?
          <Link
            href="/signup"
            className="transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}