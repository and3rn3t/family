# Family Organizer - Feature Documentation

This document provides comprehensive documentation of all features in the Family Organizer application.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
  - [Family Member Management](#family-member-management)
  - [Chore Management](#chore-management)
  - [Event Management](#event-management)
  - [Schedule View](#schedule-view)
- [Gamification Features](#gamification-features)
  - [Star Rewards System](#star-rewards-system)
  - [Achievement System](#achievement-system)
  - [Competition System](#competition-system)
- [User Interface](#user-interface)
  - [Dashboard View](#dashboard-view)
  - [Competition View](#competition-view)
  - [Schedule View](#schedule-view-1)
  - [Management View](#management-view)
- [Technical Features](#technical-features)

---

## Overview

Family Organizer is a collaborative household management application designed to:

- **Organize** household chores and family events
- **Motivate** family members through gamification
- **Display** information on kiosk displays (optimized for Raspberry Pi)
- **Persist** data locally without requiring cloud connectivity

### Design Principles

1. **Glanceable** - Information visible from across the room
2. **Collaborative** - Every family member has ownership
3. **Motivating** - Completing tasks feels rewarding

---

## Core Features

### Family Member Management

**Purpose**: Create profiles for each family member with personalized avatars.

**Capabilities**:
- Add new family members with name and avatar
- Choose from 30+ avatar icons (people, animals, symbols)
- Select from 8 vibrant color options
- Edit existing member profiles
- Delete members (also removes their assigned chores)

**Data Tracked Per Member**:
- Total stars earned (lifetime)
- Monthly stars (per calendar month)
- Weekly stars (per calendar week)
- Unlocked achievements
- Assigned chores count

**Avatar Options**:
| Category | Icons |
|----------|-------|
| People | User, Baby, Student, Person |
| Animals | Cat, Dog, Bird, Fish, Paw |
| Activities | Bicycle, Basketball, Baseball, Football |
| Nature | Tree, Flower, Sun, Moon |
| Objects | Heart, Star, Crown, Smiley |
| Food | Coffee, Cookie, Cake, Pizza |

---

### Chore Management

**Purpose**: Create, assign, and track household tasks.

**Chore Properties**:
| Property | Description |
|----------|-------------|
| Title | Name of the chore (required) |
| Description | Additional details (optional) |
| Frequency | How often the chore resets |
| Assigned To | Which family member is responsible |

**Frequency Options**:
| Frequency | Reset Period | Stars Awarded |
|-----------|--------------|---------------|
| Daily | Every 24 hours | 1 ⭐ |
| Weekly | Every 7 days | 3 ⭐ |
| Bi-weekly | Every 14 days | 5 ⭐ |
| Monthly | Every 30 days | 10 ⭐ |

**Chore States**:
- **Pending** - Not yet completed, due now or in future
- **Completed** - Done, waiting for reset based on frequency
- **Overdue** - Past due date (visual indicator shown)

**Actions**:
- ✅ Complete chore (awards stars, shows celebration)
- ✏️ Edit chore details
- 🗑️ Delete chore

---

### Event Management

**Purpose**: Track non-chore family activities and appointments.

**Event Properties**:
| Property | Description |
|----------|-------------|
| Title | Event name (required) |
| Description | Additional details |
| Category | Type of event |
| Date | When the event occurs |
| Time | Specific time (optional) |
| Assigned To | Which family member (optional) |
| Recurrence | Repeating pattern |

**Event Categories**:
| Category | Icon | Example Uses |
|----------|------|--------------|
| Sports | ⚽ | Practice, games, tournaments |
| School | 🎓 | Classes, meetings, activities |
| Medical | 🏥 | Doctor appointments, checkups |
| Social | 👥 | Parties, gatherings, playdates |
| Other | 📅 | General events |

**Recurrence Options**:
| Type | Behavior |
|------|----------|
| None | One-time event |
| Weekly | Repeats on selected days of week |
| Monthly | Repeats on same date each month |

**Weekly Recurrence**:
- Select specific days (Mon-Sun)
- Events appear only on selected days
- Optional end date for series

---

### Schedule View

**Purpose**: Calendar view showing upcoming chores and events.

**Features**:
- Weekly calendar grid layout
- Navigate between weeks (← →)
- "Today" button to jump to current week
- Current day highlighted
- Filter by family member
- Color-coded by category/member

**Schedule Content**:
- Chores displayed based on frequency and due dates
- Events with category icons and times
- Recurring event indicators
- Member avatars for assignments

**Export Options**:
| Format | Description |
|--------|-------------|
| Print | Optimized print layout |
| CSV | Spreadsheet-compatible export |
| JSON | Structured data export |

---

## Gamification Features

### Star Rewards System

**Purpose**: Motivate task completion through point rewards.

**How It Works**:
1. Each chore has a star value based on frequency
2. Completing a chore awards stars to the assigned member
3. Stars are tracked at multiple levels:
   - **Total Stars**: Lifetime accumulation
   - **Monthly Stars**: Current calendar month
   - **Weekly Stars**: Current calendar week

**Star Values** (base × difficulty multiplier):
```
Daily Chore    → 1 ⭐ base
Weekly Chore   → 3 ⭐ base
Bi-weekly Chore → 5 ⭐ base
Monthly Chore  → 10 ⭐ base

Difficulty Multipliers:
Easy   → ×1
Medium → ×2  
Hard   → ×3
```

**Display Locations**:
- Member cards on Dashboard
- Leaderboard rankings
- Competition standings
- Achievement progress

---

### Mystery Bonus Days

**Purpose**: Add excitement and surprise through random double-star days.

**How It Works**:
1. Each day has ~15% chance to be a "Mystery Bonus Day"
2. Uses deterministic randomness - all family members see the same result
3. All chores completed on bonus days earn **2× stars**
4. Animated banner appears on Dashboard when active
5. Toast notifications show the multiplied reward

**Achievements**:
- 🌟 **Lucky Star** (Common) - Complete 1 chore on a Mystery Day
- ✨ **Fortune Finder** (Rare) - Complete 5 chores on Mystery Days
- 💫 **Mystery Master** (Epic) - Complete 15 chores on Mystery Days

---

### Achievement System

**Purpose**: Provide long-term goals and recognize accomplishments.

**Achievement Rarities**:
| Rarity | Color | Difficulty |
|--------|-------|------------|
| Common | Gray | Easy to unlock |
| Rare | Teal | Moderate effort |
| Epic | Coral | Significant achievement |
| Legendary | Gold | Exceptional accomplishment |

**Available Achievements**:

#### Star-Based Achievements
| Achievement | Requirement | Rarity |
|-------------|-------------|--------|
| First Star | Earn 1 star | Common |
| Star Collector | Earn 50 total stars | Common |
| Star Master | Earn 100 total stars | Rare |
| Star Legend | Earn 250 total stars | Epic |

#### Monthly Performance
| Achievement | Requirement | Rarity |
|-------------|-------------|--------|
| Overachiever | Earn 50 stars in one month | Rare |
| Century Month | Earn 100 stars in one month | Epic |
| Consistency King | 20+ stars for 3 consecutive months | Epic |
| Dedicated Worker | Earn stars in 5 consecutive months | Rare |

#### Competition Achievements
| Achievement | Requirement | Rarity |
|-------------|-------------|--------|
| Monthly Champion | Win a monthly competition | Rare |
| Three-Peat | Win 3 consecutive monthly competitions | Legendary |
| Comeback Kid | Win after being last the previous month | Epic |

#### Task Achievements
| Achievement | Requirement | Rarity |
|-------------|-------------|--------|
| Perfect Week | Complete all assigned chores in a week | Common |

**Achievement Unlock Flow**:
1. Complete a chore → System checks all achievement conditions
2. If new achievement unlocked → Full-screen celebration animation
3. Achievement added to member profile
4. Toast notification for additional unlocks

---

### Competition System

**Purpose**: Create friendly competition among family members.

#### Monthly Competitions
- Automatically tracks stars earned during calendar month
- Live leaderboard rankings updated with each completion
- Month-end winner announcement
- Historical record of past winners

**Competition Views**:
- Current month standings with days remaining
- Podium display (🥇 🥈 🥉) for top 3
- Past competition cards showing historical winners

#### Weekly Mini-Competitions
- Track weekly star earnings
- Quick feedback cycle for motivation
- Winner announced at week's end

---

## User Interface

### Dashboard View

**Main landing page showing**:
- **Leaderboard**: Family members ranked by total stars
- **Chore List**: All chores organized by member
- **Quick Stats**: Completion percentages
- **Member Cards**: Individual progress and stats

**Actions Available**:
- Complete chores
- View member achievements
- Add new chores

---

### Competition View

**Dedicated competition tracking showing**:
- **Current Month Rankings**: Live leaderboard
- **Countdown Timer**: Days remaining in competition
- **Weekly Rankings**: Current week standings
- **Past Competitions**: Historical winners archive

**Visual Elements**:
- Trophy icons for winners
- Position indicators (1st, 2nd, 3rd with medals)
- Animated transitions on rank changes

---

### Schedule View

**Calendar interface showing**:
- **Weekly Grid**: 7-day view of activities
- **Navigation**: Previous/Next week, Today button
- **Member Filter**: Show specific member's schedule
- **Export Tools**: Print, CSV, JSON options

**Display Information**:
- Chore cards with completion status
- Event cards with category styling
- Time indicators for timed events
- Recurrence badges for repeating items

---

### Management View

**Administrative interface for**:
- **Family Members**: Add, edit, delete members
- **Member Overview**: Stats and assigned chores per member

**Layout**:
- Grid of member cards
- "Add Family Member" prominent button
- Quick access to edit/delete actions

---

## Technical Features

### Data Persistence

**Storage**: Browser localStorage via @github/spark KV
- All data persists across page refreshes
- No internet connection required
- Data survives browser restarts

**Storage Keys**:
| Key | Data Type |
|-----|-----------|
| `family-members` | FamilyMember[] |

### Data Backup & Restore

**Purpose**: Protect your family data and transfer between devices.

**Export Features**:
- Download complete backup as JSON file
- Includes all members, chores, events, competitions, and settings
- Timestamped filename for easy identification
- Human-readable format

**Import Features**:
- Restore from any valid backup file
- Schema version validation
- Preview data before importing
- Warning before replacing existing data
- Handles older backup formats gracefully

**Access**: Management tab → "Backup" button
| `chores` | Chore[] |
| `events` | Event[] |
| `monthly-competitions` | MonthlyCompetition[] |
| `weekly-competitions` | WeeklyCompetition[] |

### Kiosk Mode Support

**Optimizations for Raspberry Pi kiosk displays**:
- Large, readable text and icons
- High contrast color scheme
- Touch-friendly tap targets (48px minimum)
- Auto-hiding cursor support
- Full-screen Chromium compatibility

### View-Only Mode

**Purpose**: Prevent accidental edits on shared displays or kiosks.

**Features**:
- Toggle view-only mode from header (eye icon)
- All edit/delete buttons hidden when active
- Chore completion still works (core functionality)
- Visual banner indicates view-only status
- Optional PIN protection to unlock editing

**PIN Protection**:
- Set a 4-6 digit PIN in Management settings
- PIN required to exit view-only mode
- Prevents children from accidentally modifying data
- PIN can be removed at any time

### Progressive Web App (PWA)

**Installable App Experience**:
- Install directly from browser to device home screen
- Works offline after first visit
- Native app-like experience (no browser chrome)
- Automatic updates when online

**Supported Platforms**:
- Android (Chrome, Edge)
- iOS/iPadOS (Safari - Add to Home Screen)
- Windows (Chrome, Edge)
- macOS (Chrome, Edge)
- Linux (Chrome)

**Features**:
- Custom app icon with maskable variant
- Splash screen on launch
- App shortcuts for quick access to Dashboard/Schedule
- Cached fonts for offline use

### Responsive Design

**Breakpoints**:
| Width | Layout |
|-------|--------|
| < 768px | Single column, icons-only nav |
| 768-1024px | Two column, compact cards |
| > 1024px | Full grid, expanded details |

### Animations

**Celebration Moments**:
- Chore completion → Confetti animation
- Achievement unlock → Full-screen reveal
- Star earning → Counter animation
- Rank change → Smooth transitions

**Powered by**: Framer Motion for performant, hardware-accelerated animations

---

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| No family members | Helpful empty state with "Add Member" CTA |
| No chores assigned | Motivating empty state with quick-add |
| All chores complete | Celebration state with encouragement |
| Overdue chores | Yellow accent highlight (non-punitive) |
| Month transition | Auto-finalize competition, reset monthly stars |
| Multiple achievements | Primary animation + toasts for extras |
| Recurring event edit | Updates base pattern |
| Delete recurring event | Only base event deletable |

---

## Future Considerations

Potential enhancements for future development:
- Cloud sync / multi-device support
- Push notifications for due chores
- Custom chore frequencies
- Reward redemption system
- Photo proof of completion
- Voice assistant integration
- Multiple family/household support
