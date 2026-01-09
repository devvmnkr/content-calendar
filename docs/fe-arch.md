# Frontend Architecture Guide

## Tech Stack

| Layer         | Technology                   |
| ------------- | ---------------------------- |
| Framework     | React 19 + TypeScript        |
| Build         | Vite 7                       |
| Routing       | React Router DOM 7           |
| Styling       | Tailwind CSS 4               |
| State         | Zustand                      |
| HTTP          | Axios                        |
| Icons         | Lucide React                 |
| UI Components | Shadcn UI (Radix primitives) |

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # App shell (Layout, Sidebar, Navbar)
│   ├── theme/           # Theme-related components
│   └── ui/              # Shadcn/reusable UI primitives
├── pages/               # Route-level components
├── stores/              # Zustand state stores
├── constants/           # Strings, navigation config
├── lib/                 # Utilities (cn, axios instance)
└── styles/              # Global CSS, theme variables
```

---

## Design System

### Color Variables

All colors are defined as CSS variables in `src/styles/globals.css`. **Never hardcode colors.**

| Category         | Variables                                                                            |
| ---------------- | ------------------------------------------------------------------------------------ |
| Background       | `--bg`, `--surface-1`, `--surface-2`, `--surface-3`                                  |
| Text             | `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-inverse`            |
| Border           | `--border-default`, `--border-muted`, `--border-strong`, `--border-stronger`         |
| Primary          | `--primary-main`, `--primary-hover`, `--primary-pressed`, `--primary-subtle`         |
| Secondary        | `--secondary-main`, `--secondary-hover`, `--secondary-pressed`, `--secondary-subtle` |
| Accent 1 (Pink)  | `--accent1-main`, `--accent1-hover`, `--accent1-pressed`, `--accent1-subtle`         |
| Accent 2 (Amber) | `--accent2-main`, `--accent2-hover`, `--accent2-pressed`, `--accent2-subtle`         |

### Using Colors in Tailwind

```tsx
// Tailwind v4 theme colors (defined in @theme block)
className = "bg-primary-main text-text-primary border-border-default";

// For opacity variants, use rgba with CSS variables
className = "bg-[rgba(var(--primary-main)/0.12)]";
```

### Typography

- **Font**: Poppins (loaded via Google Fonts, deferred)
- **Weights**: 100-900 available
- Use semantic sizing: `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.

### Spacing Guidelines

| Element           | Padding                                  |
| ----------------- | ---------------------------------------- |
| Sidebar nav links | 12px vertical, 16px horizontal           |
| Page content      | 16px mobile, 24px desktop (`p-4 lg:p-6`) |
| Card components   | 16px (`p-4`)                             |
| Buttons           | Use Shadcn size variants                 |

---

## Patterns

### 1. No Hardcoded Strings

All user-facing text must be in `src/constants/strings.ts`:

```tsx
// ❌ Bad
<h1>Hello World</h1>;

// ✅ Good
import { MESSAGES } from "@/constants/strings";
<h1>{MESSAGES.HELLO_WORLD}</h1>;
```

### 2. No Hardcoded Colors

```tsx
// ❌ Bad
className = "bg-purple-500 text-white";

// ✅ Good
className = "bg-primary-main text-text-inverse";
```

### 3. State Management (Zustand)

Create focused stores per domain:

```tsx
// src/stores/exampleStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExampleState {
  value: string;
  setValue: (value: string) => void;
}

export const useExampleStore = create<ExampleState>()(
  persist(
    (set) => ({
      value: "",
      setValue: (value) => set({ value }),
    }),
    { name: "example-storage" }
  )
);
```

### 4. Component Structure

```tsx
// Imports (external → internal → types)
import { useState } from "react";
import { cn } from "@/lib/utils";
import { STRINGS } from "@/constants/strings";

// Component
export function ComponentName() {
  // Hooks
  // Derived state
  // Handlers
  // Render
  return <div>...</div>;
}
```

### 5. Responsive Design

Mobile-first approach with `lg:` breakpoint for desktop:

```tsx
// Mobile: stacked, Desktop: side-by-side
className = "flex flex-col lg:flex-row";

// Mobile: hidden sidebar, Desktop: visible
className = "hidden lg:block";
```

### 6. Active State Styling

For navigation links with active state:

```tsx
<NavLink
  to={path}
  className={({ isActive }) =>
    cn(
      "base-styles",
      isActive
        ? "bg-[rgba(var(--primary-main)/0.12)] text-primary-main"
        : "text-text-secondary"
    )
  }
>
```

---

## Adding New Features

### New Page

1. Create page component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Add nav item in `src/constants/navigation.ts`
4. Add strings in `src/constants/strings.ts`

### New UI Component

1. Create in `src/components/ui/` following Shadcn patterns
2. Use `cn()` for class merging
3. Forward refs for DOM elements
4. Use CVA for variants

### New Store

1. Create in `src/stores/newStore.ts`
2. Use `persist` middleware if state needs localStorage
3. Export typed hook: `useNewStore`

---

## File Naming

| Type          | Convention        | Example                          |
| ------------- | ----------------- | -------------------------------- |
| Components    | PascalCase        | `Sidebar.tsx`, `ThemeToggle.tsx` |
| Stores        | camelCase + Store | `sidebarStore.ts`                |
| Constants     | camelCase         | `navigation.ts`, `strings.ts`    |
| UI primitives | lowercase         | `button.tsx`, `avatar.tsx`       |
| Pages         | PascalCase        | `Home.tsx`, `Schedule.tsx`       |

---

## Theme Support

Dark mode is toggled via `.dark` class on `<html>`. The theme store handles:

- Persisting preference to localStorage
- Syncing with system preference on first load
- Toggling between light/dark

```tsx
import { useThemeStore } from "@/stores/themeStore";

const { theme, toggleTheme } = useThemeStore();
```

---

## Import Aliases

Use `@/` for absolute imports:

```tsx
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/themeStore";
import { cn } from "@/lib/utils";
```

Configured in `tsconfig.json` and `vite.config.ts`.
