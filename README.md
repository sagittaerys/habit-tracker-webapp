# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built as a Stage 3 submission following a strict Technical Requirements Document.

---

## Project Overview

Habit Tracker lets users sign up, log in, create and manage daily habits, mark completions, and view current streaks. All data is persisted locally via localStorage. The app is installable as a PWA and serves a cached app shell when offline.

---

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **motion/react** for animations
- **react-icons** for iconography
- **localStorage** for persistence
- **Vitest** + **React Testing Library** for unit and integration tests
- **Playwright** for end-to-end tests

---

## Setup

```bash
pnpm install
npx playwright install chromium
```

---

## Running the App

```bash
pnpm dev
```

Visit `http://localhost:3000`

---

## Running Tests

### Unit tests + coverage report

```bash
pnpm test:unit
```

### Integration tests

```bash
pnpm test:integration
```

### End-to-end tests

Requires the dev server to be running in a separate terminal.

```bash
# terminal 1
pnpm dev

# terminal 2
pnpm test:e2e
```

### All tests

```bash
pnpm test
```

---

## Local Persistence Structure

All data lives in `localStorage` under three keys:

| Key | Shape | Purpose |
|-----|-------|---------|
| `habit-tracker-users` | `User[]` | All registered users |
| `habit-tracker-session` | `Session \| null` | Currently logged-in user |
| `habit-tracker-habits` | `Habit[]` | All habits across all users |

Habits are filtered by `userId` on the dashboard so each user only sees their own data. No remote database or external auth service is used. Persistence is entirely local and deterministic.

### User shape

```ts
{
  id: string;
  email: string;
  password: string;
  createdAt: string;
}
```

### Session shape

```ts
{
  userId: string;
  email: string;
}
```

### Habit shape

```ts
{
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  createdAt: string;
  completions: string[]; // YYYY-MM-DD dates
}
```

---

## PWA Support

The app registers a service worker (`public/sw.js`) on the client via `components/shared/ServiceWorkerRegistration.tsx`. On first load, the service worker caches the app shell routes (`/`, `/login`, `/signup`, `/dashboard`). On subsequent visits — including offline — the cached shell is served without a hard crash.

A `public/manifest.json` defines the app name, short name, icons, theme color (`#b8ff57`), background color, and display mode (`standalone`), making the app installable on supported devices via the browser's install prompt.

---

## Trade-offs and Limitations

- **No password hashing** — passwords are stored in plain text in localStorage. Acceptable for a local-only demo but not production-safe.
- **No session expiry** — sessions persist indefinitely until the user explicitly logs out.
- **localStorage limits** — data is scoped to the device and browser. Clearing browser storage loses all data permanently.
- **Daily frequency only** — the spec requires only daily habits for this stage. Weekly or custom frequencies are not implemented.
- **PWA offline scope** — only the app shell is cached by the service worker. Dynamic data (habits, session) is read from localStorage which is always available offline, so the full app functions offline after the first load.
- **Single device** — because persistence is localStorage-based, data does not sync across devices or browsers.

---

## Test File Map

| Test File | Describe Block | What It Verifies |
|-----------|---------------|------------------|
| `tests/unit/slug.test.ts` | `getHabitSlug` | Slug generation: lowercase, hyphenation, space collapsing, special character removal |
| `tests/unit/validators.test.ts` | `validateHabitName` | Name validation: empty input, max length, trimming |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` | Streak logic: empty completions, today not completed, consecutive days, duplicates, gaps |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` | Toggle logic: add date, remove date, immutability, no duplicates |
| `tests/integration/auth-flow.test.tsx` | `auth flow` | Signup creates session, duplicate email error, login stores session, invalid credentials error |
| `tests/integration/habit-form.test.tsx` | `habit form` | Validation error on empty name, create habit, edit preserves immutable fields, delete confirmation, completion toggle updates streak |
| `tests/e2e/app.spec.ts` | `Habit Tracker app` | Full user flows in a real browser: splash screen, redirects, auth protection, signup, login, create habit, complete habit, persist on reload, logout, offline shell |

---

## Project Structure

```
habit-tracker/
├── app/
│   ├── layout.tsx
│   ├── page.tsx               # Splash + redirect logic
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── dashboard/page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   └── shared/
│       ├── SplashScreen.tsx
│       ├── HabitCard.tsx
│       ├── HabitForm.tsx
│       └── ServiceWorkerRegistration.tsx
├── lib/
│   ├── habits.ts              # toggleHabitCompletion
│   ├── slug.ts                # getHabitSlug
│   ├── storage.ts             # localStorage helpers
│   ├── streaks.ts             # calculateCurrentStreak
│   └── validators.ts          # validateHabitName
├── types/
│   ├── auth.ts                # User, Session
│   └── habit.ts               # Habit
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
└── README.md
```