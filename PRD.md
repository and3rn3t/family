# Family Organizer - Chores & Schedule Manager

A centralized family chore and schedule management system designed to run on a Raspberry Pi 4B with a kiosk display, making household task coordination effortless and visible to everyone.

**Experience Qualities**:
1. **Glanceable** - Information should be immediately visible and understandable from across the room on a kiosk display
2. **Collaborative** - Every family member should feel ownership and see their contributions clearly
3. **Motivating** - Completing tasks should feel rewarding with visual progress indicators and achievement tracking

**Complexity Level**: Light Application (multiple features with basic state)
This app manages multiple family members, their assigned chores, schedules, and completion states with a straightforward data model that persists locally.

## Essential Features

### Family Member Management
- **Functionality**: Add, edit, and remove family members with names and avatar colors
- **Purpose**: Establish clear ownership and personalization for each family member
- **Trigger**: Click "Add Family Member" button in settings/management view
- **Progression**: Click add → Enter name → Select avatar color → Save → Member appears in system
- **Success criteria**: Family members persist, display correctly in chore assignments, and can be edited or removed

### Chore Creation & Assignment
- **Functionality**: Create chores with title, description, frequency (daily/weekly/custom), and assign to family members
- **Purpose**: Define household tasks and distribute responsibility fairly
- **Trigger**: Click "Add Chore" button from main view or chore management section
- **Progression**: Click add → Enter chore details → Select frequency → Assign to member(s) → Save → Chore appears in assigned member's list
- **Success criteria**: Chores are created, assigned correctly, display with all details, and can be edited or deleted

### Chore Completion Tracking
- **Functionality**: Mark chores as complete with visual feedback and automatic reset based on frequency
- **Purpose**: Track household progress and maintain accountability
- **Trigger**: Tap/click on a chore card or completion checkbox
- **Progression**: Select chore → Mark complete → Visual celebration → Chore updates status → Auto-reset after frequency period
- **Success criteria**: Completion states persist, visual feedback is clear, and automatic resets work correctly

### Schedule/Calendar View
- **Functionality**: Display weekly schedule showing which chores are due for each family member
- **Purpose**: Provide temporal context and help with planning
- **Trigger**: Navigate to schedule view tab
- **Progression**: Open schedule → View current week → See chores organized by day and person → Identify upcoming tasks
- **Success criteria**: Schedule accurately reflects chore frequencies, updates in real-time, and shows current day prominently

### Progress Dashboard
- **Functionality**: Show completion statistics per family member and overall household progress
- **Purpose**: Motivate through visible achievement and fair distribution visualization
- **Trigger**: View main dashboard (default view)
- **Progression**: App loads → Dashboard displays → Shows completion percentages → Highlights top contributors
- **Success criteria**: Statistics are accurate, update immediately upon completion, and display engagingly

## Edge Case Handling

- **No Family Members** - Display helpful empty state encouraging user to add their first family member
- **No Chores Assigned** - Show motivating empty state with quick-add chore button
- **All Chores Complete** - Celebrate with special visual state and encouraging message
- **Overdue Chores** - Highlight overdue items with distinct visual treatment without being punitive
- **Device Offline** - All data persists locally; no cloud dependency required
- **Screen Timeout/Kiosk Reset** - App state persists through page refreshes

## Design Direction

The design should evoke a warm, household-friendly feeling with playful energy that makes chores feel less like work. It should be inviting and celebratory rather than corporate or sterile. Think modern kitchen appliance meets family game board - functional but fun.

## Color Selection

A vibrant, energetic palette that brings life and positivity to household tasks, inspired by modern home decor and organizational tools.

- **Primary Color**: Vibrant Teal (`oklch(0.65 0.15 200)`) - Represents fresh energy and cleanliness, used for primary actions and active states
- **Secondary Colors**: 
  - Warm Coral (`oklch(0.72 0.14 25)`) - For encouragement and celebration moments
  - Soft Lavender (`oklch(0.75 0.09 290)`) - For calm, completed states
- **Accent Color**: Sunny Yellow (`oklch(0.85 0.15 95)`) - Attention-grabbing for overdue items and important CTAs
- **Foreground/Background Pairings**:
  - Background (Soft Cream `oklch(0.97 0.01 85)`): Dark Text (`oklch(0.25 0.02 280)`) - Ratio 12.5:1 ✓
  - Primary Teal (`oklch(0.65 0.15 200)`): White (`oklch(1 0 0)`) - Ratio 4.9:1 ✓
  - Accent Yellow (`oklch(0.85 0.15 95)`): Dark Text (`oklch(0.25 0.02 280)`) - Ratio 8.2:1 ✓
  - Warm Coral (`oklch(0.72 0.14 25)`): White (`oklch(1 0 0)`) - Ratio 4.6:1 ✓

## Font Selection

Typography should feel friendly and approachable while maintaining excellent readability on a kiosk display viewed from various distances. Using Outfit for its geometric warmth and Inter for reliable body text.

- **Typographic Hierarchy**:
  - H1 (Page Title): Outfit Bold / 36px / -0.02em letter spacing / 1.1 line height
  - H2 (Section Headers): Outfit Semibold / 24px / -0.01em letter spacing / 1.2 line height
  - H3 (Card Titles): Outfit Medium / 18px / normal spacing / 1.3 line height
  - Body (Descriptions): Inter Regular / 15px / normal spacing / 1.6 line height
  - Small (Metadata): Inter Medium / 13px / 0.01em spacing / 1.4 line height

## Animations

Animations should celebrate completion actions and provide clear feedback for interactions, making the experience feel responsive and rewarding. Key moments: chore completion (confetti-style celebration), card interactions (gentle lift and scale), view transitions (smooth slide), and progress updates (animated counters).

## Component Selection

- **Components**:
  - **Card**: Chore items with hover states and completion actions
  - **Badge**: Status indicators (Complete, Overdue, Pending)
  - **Avatar**: Family member representation with initials and color
  - **Progress**: Visual completion bars for family members
  - **Tabs**: Navigation between Dashboard, Schedule, and Management views
  - **Dialog**: Adding/editing family members and chores
  - **Button**: Primary actions with distinct visual hierarchy
  - **Form/Input/Label**: Chore and family member creation forms
  - **Checkbox**: Chore completion toggles
  - **Select**: Frequency selection and family member assignment
  - **Calendar**: Schedule view component

- **Customizations**:
  - **Chore Cards**: Custom component with completion checkbox, assigned member avatar, frequency badge, and description
  - **Family Member Cards**: Custom stat cards showing member name, avatar, completion percentage, and active chores count
  - **Weekly Schedule Grid**: Custom calendar-style layout showing chores organized by day and person
  - **Celebration Component**: Custom animation overlay for completed chores using framer-motion

- **States**:
  - **Buttons**: Resting (solid primary), Hover (slightly darker with subtle lift), Active (pressed down), Disabled (muted with reduced opacity)
  - **Chore Cards**: Pending (normal), Hover (elevated shadow), Overdue (yellow accent border), Complete (muted with checkmark and lavender tint)
  - **Input Fields**: Empty (subtle border), Focus (primary color border with glow), Filled (darker border), Error (destructive color border)

- **Icon Selection**:
  - **Plus** - Add new chore/member
  - **Check** - Mark complete
  - **Calendar** - Schedule view
  - **ChartBar** - Dashboard/stats
  - **Users** - Family member management
  - **Trash** - Delete actions
  - **PencilSimple** - Edit actions
  - **ClockCounterClockwise** - Recurring/frequency indicator
  - **Star** - Achievement/top performer

- **Spacing**:
  - Container padding: `p-6` (24px) on mobile, `p-8` (32px) on tablet+
  - Card padding: `p-4` (16px) internal
  - Grid gaps: `gap-4` (16px) for cards, `gap-6` (24px) for sections
  - Section spacing: `space-y-6` (24px) between major sections
  - Button padding: `px-6 py-3` for primary, `px-4 py-2` for secondary

- **Mobile**:
  - Single column layout for all cards on mobile (<768px)
  - Bottom tab navigation instead of side tabs
  - Larger touch targets (min 48px) for all interactive elements
  - Condensed header with hamburger menu for management
  - Horizontal scroll for weekly schedule view
  - Full-screen dialogs on mobile instead of centered modals
