export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today ?? new Date().toISOString().split('T')[0]

  // added this to prevent duplication and sort ascending
  const unique = [...new Set(completions)].sort()

  // this is expected to reset if the streak is 0
  if (!unique.includes(todayDate)) return 0

  
  let streak = 0
  let current = new Date(todayDate)

  while (true) {
    const dateStr = current.toISOString().split('T')[0]
    if (!unique.includes(dateStr)) break
    streak++
    current.setDate(current.getDate() - 1)
  }

  return streak
}