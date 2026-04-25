'use client'

import { useState } from 'react'
import { validateHabitName } from '@/lib/validators'
import type { Habit } from '@/types/habit'

type Props = {
  onSave: (data: { name: string; description: string }) => void
  onCancel: () => void
  initial?: Habit
}

export default function HabitForm({ onSave, onCancel, initial }: Props) {
  const [nameError, setNameError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value

    const validation = validateHabitName(name)
    if (!validation.valid) {
      setNameError(validation.error)
      return
    }

    onSave({ name: validation.value, description })
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-5 rounded-xl"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="habit-name"
          className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          Habit Name
        </label>
        <input
          id="habit-name"
          name="name"
          type="text"
          data-testid="habit-name-input"
          defaultValue={initial?.name ?? ''}
          placeholder="e.g. Drink Water"
          className="w-full px-4 py-3 rounded-lg text-white text-sm"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          onChange={() => setNameError(null)}
        />
        {nameError && (
          <p
            className="text-xs"
            style={{ color: '#ff6b6b', fontFamily: 'var(--font-mono)' }}
          >
            {nameError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="habit-description"
          className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          Description <span style={{ color: 'var(--muted)' }}>(optional)</span>
        </label>
        <textarea
          id="habit-description"
          name="description"
          data-testid="habit-description-input"
          defaultValue={initial?.description ?? ''}
          placeholder="Why does this habit matter?"
          rows={3}
          className="w-full px-4 py-3 rounded-lg text-white text-sm resize-none"
          style={{
            background: 'var(--bg)',
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
          htmlFor="habit-frequency"
          className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          name="frequency"
          data-testid="habit-frequency-select"
          className="w-full px-4 py-3 rounded-lg text-white text-sm"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            outline: 'none',
          }}
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 py-3 rounded-lg font-bold text-sm tracking-wide"
          style={{
            background: 'var(--accent)',
            color: '#000',
            fontFamily: 'var(--font-syne)',
          }}
        >
          {initial ? 'Save changes' : 'Create habit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 rounded-lg text-sm"
          style={{
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}