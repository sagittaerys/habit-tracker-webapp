'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { BsPlus } from 'react-icons/bs'
import { getSession, clearSession, getHabits, saveHabits } from '@/lib/storage'
import HabitCard from '@/components/shared/HabitCard'
import HabitForm from '@/components/shared/HabitForm'
import type { Habit } from '@/types/habit'
import type { Session } from '@/types/auth'

type Mode =
  | { type: 'idle' }
  | { type: 'creating' }
  | { type: 'editing'; habit: Habit }

export default function DashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [mode, setMode] = useState<Mode>({ type: 'idle' })

  useEffect(() => {
    const s = getSession()
    if (!s) {
      router.replace('/login')
      return
    }
    setSession(s)
    const all = getHabits()
    setHabits(all.filter((h) => h.userId === s.userId))
  }, [router])

  function handleSaveHabits(updated: Habit[]) {
    const all = getHabits()
    const others = all.filter((h) => h.userId !== session!.userId)
    saveHabits([...others, ...updated])
    setHabits(updated)
  }

  function handleSaveFromForm(habit: Habit) {
    setHabits((prev) =>
      prev.find((h) => h.id === habit.id)
        ? prev.map((h) => (h.id === habit.id ? habit : h))
        : [...prev, habit]
    )
    setMode({ type: 'idle' })
  }

  function handleDelete(id: string) {
    const updated = habits.filter((h) => h.id !== id)
    handleSaveHabits(updated)
  }

  function handleUpdate(updated: Habit) {
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)))
  }

  function handleLogout() {
    clearSession()
    router.replace('/login')
  }

  if (!session) return null

  return (
    <main
      data-testid="dashboard-page"
      className="min-h-screen px-4 py-8 max-w-xl mx-auto"
    >
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
          >
            Habit Tracker
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Your Habits</h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
          >
            {session.email}
          </p>
        </div>
        <button
          data-testid="auth-logout-button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm transition-colors"
          style={{
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Log out
        </button>
      </div>

      {/* form */}
      <AnimatePresence>
        {mode.type !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <HabitForm
              editing={mode.type === 'editing' ? mode.habit : null}
              onSave={handleSaveFromForm}
              onCancel={() => setMode({ type: 'idle' })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* habit list */}
      {habits.length === 0 ? (
        <div
          data-testid="empty-state"
          className="flex flex-col items-center justify-center py-20 gap-3"
        >
          <p
            className="text-4xl"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            —
          </p>
          <p className="font-semibold">No habits yet</p>
          <p
            className="text-sm text-center"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
          >
            Create your first habit and start your streak
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {habits.map((habit, i) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                <HabitCard
                  habit={habit}
                  onEdit={(h) => setMode({ type: 'editing', habit: h })}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* create button */}
      {mode.type === 'idle' && (
        <motion.button
          data-testid="create-habit-button"
          onClick={() => setMode({ type: 'creating' })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          style={{ background: 'var(--accent)' }}
          aria-label="Create habit"
        >
          <BsPlus size={28} color="#000" />
        </motion.button>
      )}
    </main>
  )
}