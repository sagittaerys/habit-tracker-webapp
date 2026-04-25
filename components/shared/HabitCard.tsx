'use client'

import { useState } from 'react'
import { BsCheckCircleFill, BsCircle, BsPencil, BsTrash } from 'react-icons/bs'
import { getHabitSlug } from '@/lib/slug'
import { calculateCurrentStreak } from '@/lib/streaks'
import type { Habit } from '@/types/habit'

type Props = {
  habit: Habit
  // onToggle: (habit: Habit) => void
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
   onUpdate: (habit: Habit) => void
}

export default function HabitCard({ habit,  onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const slug = getHabitSlug(habit.name)
  const today = new Date().toISOString().split('T')[0]
  const streak = calculateCurrentStreak(habit.completions, today)
  const isCompleted = habit.completions.includes(today)

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all"
      style={{
        background: isCompleted ? '#0f1a00' : 'var(--surface)',
        border: `1px solid ${isCompleted ? '#b8ff5733' : 'var(--border)'}`,
      }}
    >
      {/* complete toggle */}
      {/* <button
        data-testid={`habit-complete-${slug}`}
        onClick={() => onToggle(habit)}
        className="flex-shrink-0 transition-transform hover:scale-110"
        aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        {isCompleted ? (
          <BsCheckCircleFill size={24} style={{ color: 'var(--accent)' }} />
        ) : (
          <BsCircle size={24} style={{ color: 'var(--muted)' }} />
        )}
      </button> */}

      {/* habit info */}
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-sm truncate"
          style={{
            color: isCompleted ? 'var(--accent)' : 'white',
            textDecoration: isCompleted ? 'line-through' : 'none',
            opacity: isCompleted ? 0.8 : 1,
          }}
        >
          {habit.name}
        </p>
        {habit.description && (
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
          >
            {habit.description}
          </p>
        )}
      </div>

      {/* streak */}
      <div
        data-testid={`habit-streak-${slug}`}
        className="flex flex-col items-center flex-shrink-0"
      >
        <span
          className="text-xl font-bold leading-none"
          style={{
            color: streak > 0 ? 'var(--accent)' : 'var(--muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {streak}
        </span>
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          {streak === 1 ? 'day' : 'days'}
        </span>
      </div>

      {/* actions */}
      {!confirmDelete ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            className="p-2 rounded-lg transition-colors hover:bg-white/5"
            aria-label="Edit habit"
          >
            <BsPencil size={14} style={{ color: 'var(--muted)' }} />
          </button>
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
            aria-label="Delete habit"
          >
            <BsTrash size={14} style={{ color: 'var(--muted)' }} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-xs"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
          >
            Delete?
          </span>
          <button
            data-testid="confirm-delete-button"
            onClick={() => onDelete(habit.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: '#ff6b6b22', color: '#ff6b6b', fontFamily: 'var(--font-mono)' }}
          >
            Yes
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
          >
            No
          </button>
        </div>
      )}
    </div>
  )
}