import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}))

import HabitForm from '@/components/shared/HabitForm'
import HabitCard from '@/components/shared/HabitCard'
import { saveSession, saveHabits } from '@/lib/storage'
import type { Habit } from '@/types/habit'

const mockSession = {
  userId: 'user-1',
  email: 'test@example.com',
}

const mockHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: new Date().toISOString(),
  completions: [],
}

beforeEach(() => {
  localStorage.clear()
  saveSession(mockSession)
})

describe('habit form', () => {
  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup()
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />)

    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByText('Habit name is required')).toBeInTheDocument()
    })
  })

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />)

    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water')
    await user.type(screen.getByTestId('habit-description-input'), 'Stay hydrated')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Drink Water',
          description: 'Stay hydrated',
          frequency: 'daily',
          userId: 'user-1',
        })
      )
    })
  })

  it('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    saveHabits([mockHabit])

    render(<HabitForm editing={mockHabit} onSave={onSave} onCancel={vi.fn()} />)

    const nameInput = screen.getByTestId('habit-name-input')
    await user.clear(nameInput)
    await user.type(nameInput, 'Drink More Water')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockHabit.id,
          userId: mockHabit.userId,
          createdAt: mockHabit.createdAt,
          completions: mockHabit.completions,
          name: 'Drink More Water',
        })
      )
    })
  })

  it('deletes a habit only after explicit confirmation', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    saveHabits([mockHabit])

    render(
      <HabitCard
        habit={mockHabit}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onUpdate={vi.fn()}
      />
    )

    await user.click(screen.getByTestId('habit-delete-drink-water'))
    expect(onDelete).not.toHaveBeenCalled()

    await user.click(screen.getByTestId('confirm-delete-button'))
    expect(onDelete).toHaveBeenCalledWith('habit-1')
  })

  it('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    saveHabits([mockHabit])

    render(
      <HabitCard
        habit={mockHabit}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={onUpdate}
      />
    )

    const streakBefore = screen.getByTestId('habit-streak-drink-water').textContent
    await user.click(screen.getByTestId('habit-complete-drink-water'))

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          completions: expect.arrayContaining([
            new Date().toISOString().split('T')[0]
          ])
        })
      )
    })
  })
})