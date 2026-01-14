# Contributing to Family Organizer

Thank you for your interest in contributing to Family Organizer! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- A modern code editor (VS Code recommended)

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/family-organizer.git
   cd family-organizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Project Architecture

### Directory Structure

```
family-organizer/
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Entry point
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives
│   │   ├── *View.tsx        # Main view components
│   │   ├── *Dialog.tsx      # Modal dialogs
│   │   ├── *Card.tsx        # Card components
│   │   └── *.tsx            # Other components
│   ├── lib/
│   │   ├── types.ts         # TypeScript definitions
│   │   ├── helpers.ts       # Utility functions
│   │   ├── achievements.ts  # Achievement system
│   │   ├── avatar-icons.ts  # Avatar definitions
│   │   └── utils.ts         # shadcn utilities
│   ├── hooks/               # Custom React hooks
│   └── styles/              # CSS files
├── public/                  # Static assets
├── .cursorrules             # AI agent instructions
├── .github/
│   └── copilot-instructions.md
└── docs/                    # Additional documentation
```

### Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite 7.x |
| Styling | Tailwind CSS 4.x |
| UI Components | shadcn/ui v4 |
| Icons | Phosphor Icons |
| Animations | Framer Motion |
| State | @github/spark KV |
| Forms | react-hook-form + zod |
| Notifications | Sonner |

## Code Style Guidelines

### TypeScript

- Use strict TypeScript - avoid `any` types
- Define explicit interfaces for all props and data structures
- Use `interface` for object shapes, `type` for unions/primitives
- Export shared types from `src/lib/types.ts`

```typescript
// ✅ Good
interface ChoreCardProps {
  chore: Chore;
  member: FamilyMember;
  onComplete: (choreId: string) => void;
}

// ❌ Bad
function ChoreCard(props: any) { ... }
```

### React Components

- Use functional components with hooks
- Define props interface at the top of the file
- Use destructuring for props
- Keep components focused and under 200 lines

```typescript
// ✅ Good
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function CustomButton({ variant = 'primary', onClick, children }: ButtonProps) {
  return (
    <Button variant={variant} onClick={onClick}>
      {children}
    </Button>
  );
}
```

### Styling

- Use Tailwind CSS classes exclusively
- Use the `cn()` utility for conditional classes
- Follow mobile-first responsive design
- Use CSS variables from the theme

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "flex items-center gap-4 p-4 rounded-lg",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />
```

### State Management

- Use `useKV` from @github/spark for persistent state
- Always provide safe defaults for nullable data
- Use functional updates for state modifications

```typescript
const [members, setMembers] = useKV<FamilyMember[]>('family-members', []);
const safeMembers = members || [];

// Functional update
setMembers((current) => [...(current || []), newMember]);
```

### Icons

- Use Phosphor Icons exclusively (`@phosphor-icons/react`)
- Import icons individually to minimize bundle size

```typescript
import { Star, Trophy, Check } from '@phosphor-icons/react';

<Star className="h-4 w-4" weight="fill" />
```

## Adding New Features

### 1. Define Types

Add new interfaces to `src/lib/types.ts`:

```typescript
export interface NewFeature {
  id: string;
  name: string;
  // ... other properties
}
```

### 2. Add Helper Functions

Add utility functions to `src/lib/helpers.ts`:

```typescript
export function processNewFeature(data: NewFeature): Result {
  // Implementation
}
```

### 3. Create Components

Create new components in `src/components/`:

```typescript
// src/components/NewFeatureCard.tsx
interface NewFeatureCardProps {
  feature: NewFeature;
  onAction: (id: string) => void;
}

export function NewFeatureCard({ feature, onAction }: NewFeatureCardProps) {
  return (
    // JSX
  );
}
```

### 4. Wire Up State

Add state management in `App.tsx`:

```typescript
const [features, setFeatures] = useKV<NewFeature[]>('features', []);
```

### 5. Add to Views

Integrate with appropriate view component.

## Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Available components: https://ui.shadcn.com/docs/components

## Testing

### Manual Testing Checklist

Before submitting changes, verify:

- [ ] Feature works on desktop (1920x1080)
- [ ] Feature works on tablet (768px width)
- [ ] Feature works on mobile (375px width)
- [ ] Touch interactions work correctly
- [ ] Keyboard navigation works
- [ ] Data persists across page refreshes
- [ ] No console errors or warnings
- [ ] Animations are smooth and purposeful

### Build Verification

```bash
# Type checking
npm run build

# Linting
npm run lint

# Preview production build
npm run preview
```

## Commit Guidelines

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build/tooling changes

### Examples

```
feat(achievements): add new "Early Bird" achievement
fix(chores): correct star calculation for biweekly chores
docs(readme): update deployment instructions
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the code style guidelines
3. Test your changes thoroughly
4. Update documentation if needed
5. Submit a pull request with a clear description
6. Address any review feedback

## Questions?

If you have questions or need help, please:

1. Check existing documentation
2. Search closed issues for similar questions
3. Open a new issue with the "question" label

Thank you for contributing! 🎉
