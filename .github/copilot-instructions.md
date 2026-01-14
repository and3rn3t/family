# GitHub Copilot Instructions - Family Organizer

## Project Context

This is a **Family Organizer** application built with React 19, TypeScript, Vite, and Tailwind CSS. It's a collaborative chore and schedule management system with gamification features including star rewards, achievements, and competitions.

## Tech Stack Quick Reference

- **React 19** with functional components and hooks
- **TypeScript** (strict mode)
- **Vite 7.x** for build tooling
- **Tailwind CSS 4.x** with oklch color palette
- **shadcn/ui v4** for UI primitives (Radix-based)
- **Phosphor Icons** (`@phosphor-icons/react`)
- **Framer Motion** for animations
- **@github/spark** for persistent KV storage
- **react-hook-form** + **zod** for forms
- **sonner** for toast notifications

## Code Style Preferences

### TypeScript
- Always use explicit types; avoid `any`
- Use interfaces for object shapes, types for unions
- Import types from `@/lib/types`
- Use optional chaining and nullish coalescing

### React Components
```typescript
// Preferred component structure
interface ComponentProps {
  prop1: string;
  prop2?: number;
  onAction: (id: string) => void;
}

export function Component({ prop1, prop2, onAction }: ComponentProps) {
  // hooks first
  const [state, setState] = useState<Type>(defaultValue);
  
  // handlers
  const handleClick = useCallback(() => {
    onAction(prop1);
  }, [prop1, onAction]);
  
  // render
  return (
    <div className="flex items-center gap-4">
      {/* content */}
    </div>
  );
}
```

### State Management
```typescript
// Using Spark KV for persistent state
const [items, setItems] = useKV<Item[]>('storage-key', []);

// Safe access pattern
const safeItems = items || [];

// Functional updates
setItems((current) => [...(current || []), newItem]);
```

### Styling with Tailwind
```typescript
// Use cn() for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  variant === 'primary' && "primary-classes"
)} />
```

## Import Patterns

```typescript
// React
import { useState, useEffect, useCallback, useMemo } from 'react';

// Spark KV
import { useKV } from '@github/spark/hooks';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Icons (Phosphor)
import { Star, Trophy, Check, Plus, Trash, PencilSimple } from '@phosphor-icons/react';

// Types
import { FamilyMember, Chore, Event, ChoreFrequency } from '@/lib/types';

// Utilities
import { cn } from '@/lib/utils';
import { getStarsForChore, isChoreComplete } from '@/lib/helpers';
```

## Key Data Types

```typescript
interface FamilyMember {
  id: string;
  name: string;
  color: string;
  avatarUrl?: string;
  avatarIcon?: string;
  stars?: number;
  achievements?: string[];
  monthlyStars?: Record<string, number>;
  weeklyStars?: Record<string, number>;
}

interface Chore {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  assignedTo: string;
  createdAt: number;
  lastCompleted?: number;
}

type EventCategory = 'sports' | 'school' | 'medical' | 'social' | 'other';
type RecurrenceType = 'none' | 'weekly' | 'monthly';
```

## Common Patterns

### Dialog/Modal Pattern
```typescript
const [dialogOpen, setDialogOpen] = useState(false);
const [editingItem, setEditingItem] = useState<Item | undefined>();

const handleEdit = (item: Item) => {
  setEditingItem(item);
  setDialogOpen(true);
};

const handleAdd = () => {
  setEditingItem(undefined);
  setDialogOpen(true);
};
```

### Toast Notifications
```typescript
import { toast } from 'sonner';

toast.success('Action completed!');
toast.success('Action completed!', { description: 'Additional details' });
toast.error('Something went wrong');
```

### Animation with Framer Motion
```typescript
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {show && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

## Star Rewards

| Frequency | Stars Earned |
|-----------|--------------|
| Daily     | 1 ⭐         |
| Weekly    | 3 ⭐         |
| Bi-weekly | 5 ⭐         |
| Monthly   | 10 ⭐        |

## File Organization

- **Views**: `src/components/*View.tsx` - Main tab views
- **Dialogs**: `src/components/*Dialog.tsx` - Modal forms
- **Cards**: `src/components/*Card.tsx` - Display cards
- **UI Primitives**: `src/components/ui/` - shadcn components
- **Types**: `src/lib/types.ts`
- **Helpers**: `src/lib/helpers.ts`
- **Achievements**: `src/lib/achievements.ts`

## Don'ts

- Don't use `any` types
- Don't mutate state directly
- Don't skip TypeScript interfaces for props
- Don't use inline styles (use Tailwind)
- Don't import from lucide-react (use @phosphor-icons/react)
- Don't create new color values (use theme variables)
