import SignupForm from '@/components/auth/SignupForm'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-sm flex flex-col gap-8">

        <div className="flex flex-col gap-1">
          <div
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
          >
            Habit Tracker
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Start building</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Create an account and track your first habit
          </p>
        </div>

        <SignupForm />

        <p
          className="text-sm text-center"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          Have an account?
          <Link
            href="/login"
            className="transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}