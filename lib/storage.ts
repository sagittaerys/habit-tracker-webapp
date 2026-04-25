import type { User, Session } from '@/types/auth'
import type { Habit } from '@/types/habit'

const KEYS = {
  users: 'habit-tracker-users',
  session: 'habit-tracker-session',
  habits: 'habit-tracker-habits',
} as const

// users
export function getUsers(): User[] {
  const data = localStorage.getItem(KEYS.users)
  return data ? JSON.parse(data) : []
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(KEYS.users, JSON.stringify(users))
}

// session
export function getSession(): Session | null {
  const data = localStorage.getItem(KEYS.session)
  return data ? JSON.parse(data) : null
}

export function saveSession(session: Session | null): void {
  localStorage.setItem(KEYS.session, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.session)
}

// habits
export function getHabits(): Habit[] {
  const data = localStorage.getItem(KEYS.habits)
  return data ? JSON.parse(data) : []
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(KEYS.habits, JSON.stringify(habits))
}