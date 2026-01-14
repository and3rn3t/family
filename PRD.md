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
- **Functionality**: Mark chores as complete with visual feedback, automatic reset based on frequency, and star rewards
- **Purpose**: Track household progress, maintain accountability, and motivate through achievement rewards
- **Trigger**: Tap/click on a chore card or completion checkbox
- **Progression**: Select chore → Mark complete → Visual celebration → Stars awarded → Chore updates status → Auto-reset after frequency period
- **Success criteria**: Completion states persist, visual feedback is clear, stars are awarded correctly, and automatic resets work correctly

### Reward Points System
- **Functionality**: Earn stars when completing chores based on frequency (Daily: 1⭐, Weekly: 3⭐, Bi-weekly: 5⭐, Monthly: 10⭐); stars are tracked both overall and monthly
- **Purpose**: Gamify household tasks, provide tangible motivation for completing chores, and fuel monthly competitions
- **Trigger**: Completing any chore automatically awards stars
- **Progression**: Complete chore → Stars calculated based on frequency → Member's total and monthly totals updated → Leaderboard refreshes → Success toast shows stars earned → Check for new achievements
- **Success criteria**: Stars are calculated correctly, persist across sessions, display on member cards, show in leaderboard rankings, and monthly totals track separately

### Monthly Competition System
- **Functionality**: Automatic monthly star competition that tracks each member's stars for the current month, displays live rankings, and crowns a winner at month's end
- **Purpose**: Create friendly competition, encourage consistent participation, and celebrate monthly achievements
- **Trigger**: Automatically starts each month; members earn stars toward the current competition
- **Progression**: Month begins → Members earn stars → Competition view shows live rankings → Month ends → Winner declared → Competition archived → New month begins
- **Success criteria**: Monthly stars track accurately, competitions finalize automatically, past winners are displayed, and notifications celebrate monthly winners

### Achievement System
- **Functionality**: Unlock special achievements based on milestones (total stars, monthly performance, streaks, competition wins) with different rarity levels (common, rare, epic, legendary)
- **Purpose**: Provide long-term goals, recognize diverse accomplishments, and add depth to the gamification
- **Trigger**: Automatically checked when members earn stars, complete chores, or win competitions
- **Progression**: Earn stars/complete actions → System checks achievement conditions → New achievements unlock → Animated celebration displays → Achievement added to member profile → Can view all achievements per member
- **Success criteria**: Achievements unlock correctly, animations display properly, achievement progress persists, and members can view their earned achievements

### Schedule/Calendar View
- **Functionality**: Display weekly schedule showing which chores are due for each family member
- **Purpose**: Provide temporal context and help with planning
- **Trigger**: Navigate to schedule view tab
- **Progression**: Open schedule → View current week → See chores organized by day and person → Identify upcoming tasks
- **Success criteria**: Schedule accurately reflects chore frequencies, updates in real-time, and shows current day prominently

### Progress Dashboard
- **Functionality**: Show completion statistics per family member, overall household progress, star leaderboard, and current monthly competition standings
- **Purpose**: Motivate through visible achievement, fair distribution visualization, friendly competition, and real-time monthly rankings
- **Trigger**: View main dashboard (default view)
- **Progression**: App loads → Dashboard displays → Shows leaderboard with star rankings → Shows completion percentages → Highlights achievements → Displays monthly competition status
- **Success criteria**: Statistics are accurate, update immediately upon completion, leaderboard sorts correctly by stars, displays engagingly, and monthly standings reflect current month

### Competition View
- **Functionality**: Dedicated view showing current month's live rankings, days remaining, past competition winners, and historical performance
- **Purpose**: Focus attention on monthly competition, celebrate past winners, and encourage ongoing participation
- **Trigger**: Navigate to Competition tab
- **Progression**: Open tab → View current month rankings → See countdown timer → Review past competition winners → Identify top performers across multiple months
- **Success criteria**: Current rankings update in real-time, past competitions display accurately with winners, and interface is visually engaging

## Edge Case Handling

- **No Family Members** - Display helpful empty state encouraging user to add their first family member
- **No Chores Assigned** - Show motivating empty state with quick-add chore button
- **All Chores Complete** - Celebrate with special visual state and encouraging message
- **Overdue Chores** - Highlight overdue items with distinct visual treatment without being punitive
- **Device Offline** - All data persists locally; no cloud dependency required
- **Screen Timeout/Kiosk Reset** - App state persists through page refreshes
- **Month Transition** - Automatically finalize previous month's competition, declare winner, reset monthly star counts, and start new competition
- **No Competition Activity** - Handle months where no stars were earned gracefully
- **Achievement Spam** - If multiple achievements unlock simultaneously, show primary notification and toast for additional ones

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

Animations should celebrate completion actions and provide clear feedback for interactions, making the experience feel responsive and rewarding. Key moments: chore completion (confetti-style celebration), achievement unlocks (dramatic reveal with particles), card interactions (gentle lift and scale), view transitions (smooth slide), monthly competition updates (animated counters and rankings), and progress updates (animated counters).

## Component Selection

- **Components**:
  - **Card**: Chore items with hover states and completion actions
  - **Badge**: Status indicators (Complete, Overdue, Pending), achievement rarities, competition status
  - **Avatar**: Family member representation with initials and color
  - **Progress**: Visual completion bars for family members
  - **Tabs**: Navigation between Dashboard, Competition, Schedule, and Management views
  - **Dialog**: Adding/editing family members and chores, viewing member achievements
  - **Button**: Primary actions with distinct visual hierarchy
  - **Form/Input/Label**: Chore and family member creation forms
  - **Checkbox**: Chore completion toggles
  - **Select**: Frequency selection and family member assignment
  - **Calendar**: Schedule view component

- **Customizations**:
  - **Chore Cards**: Custom component with completion checkbox, assigned member avatar, frequency badge, star value indicator, and description
  - **Family Member Cards**: Custom stat cards showing member name, avatar, total stars earned, monthly stars, completion percentage, active chores count, and achievement count with click-to-view
  - **Leaderboard**: Custom ranking component showing family members sorted by stars with trophy/medal icons for top 3
  - **Competition Rankings**: Enhanced ranking cards with position indicators, animated transitions, special styling for podium positions (gold/silver/bronze)
  - **Achievement Grid**: Custom grid showing all achievements with unlock status, rarity indicators, icons, and progress states
  - **Achievement Unlock Animation**: Full-screen celebration overlay with rarity-based colors, particle effects, and auto-dismiss
  - **Monthly Competition Card**: Large featured card showing current month standings, countdown, and live rankings
  - **Past Competition Cards**: Compact cards showing historical winners and final standings
  - **Weekly Schedule Grid**: Custom calendar-style layout showing chores organized by day and person
  - **Celebration Component**: Custom animation overlay for completed chores using framer-motion

- **States**:
  - **Buttons**: Resting (solid primary), Hover (slightly darker with subtle lift), Active (pressed down), Disabled (muted with reduced opacity)
  - **Chore Cards**: Pending (normal), Hover (elevated shadow), Overdue (yellow accent border), Complete (muted with checkmark and lavender tint)
  - **Achievement Cards**: Locked (grayscale, muted), Unlocked (full color with rarity-based accent)
  - **Competition Rankings**: Active month (highlighted border and background), Past competitions (standard card style)
  - **Input Fields**: Empty (subtle border), Focus (primary color border with glow), Filled (darker border), Error (destructive color border)

- **Icon Selection**:
  - **Plus** - Add new chore/member
  - **Check** - Mark complete
  - **Calendar/CalendarBlank** - Schedule view, monthly tracking
  - **ChartBar** - Dashboard/stats
  - **Users** - Family member management
  - **Trophy** - Competition, leaderboard, winners, achievements
  - **Trash** - Delete actions
  - **PencilSimple** - Edit actions
  - **ClockCounterClockwise** - Recurring/frequency indicator
  - **Star** - Achievement/reward points display
  - **Medal** - Second and third place rankings
  - **Fire** - Active competition, streaks
  - **Lightning** - High achievement, power performance
  - **Sparkle** - Achievement unlock, special moments
  - **Rocket** - Overachiever achievements
  - **TrendUp** - Progress, comeback achievements
  - **CheckCircle** - Completion achievements

- **Spacing**:
  - Container padding: `p-6` (24px) on mobile, `p-8` (32px) on tablet+
  - Card padding: `p-4` (16px) internal
  - Grid gaps: `gap-4` (16px) for cards, `gap-6` (24px) for sections
  - Section spacing: `space-y-6` (24px) between major sections
  - Button padding: `px-6 py-3` for primary, `px-4 py-2` for secondary

- **Mobile**:
  - Single column layout for all cards on mobile (<768px)
  - Four-column tab navigation adapting to icons-only on smallest screens
  - Larger touch targets (min 48px) for all interactive elements
  - Condensed header with hamburger menu for management
  - Horizontal scroll for weekly schedule view
  - Horizontal scroll for competition rankings on mobile
  - Full-screen dialogs on mobile instead of centered modals
  - Achievement grid collapses to single column
  - Compact achievement cards with essential info only
