# Family Organizer

A beautiful, collaborative family chore and schedule management system designed to run on a Raspberry Pi 4B with a kiosk display. Built with React, TypeScript, and Tailwind CSS.

## Features

- 👨‍👩‍👧‍👦 **Family Member Management** - Add and manage family members with custom avatars
- ✅ **Chore Tracking** - Create, assign, and track household chores
- 📅 **Weekly Schedule** - Visual calendar showing upcoming chores
- 📊 **Progress Dashboard** - See completion stats and family progress
- 🎉 **Celebration Animations** - Rewarding feedback when chores are completed
- 💾 **Persistent Storage** - All data saved locally using Spark KV storage
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Beautiful UI** - Vibrant, modern design that makes chores fun

## Quick Start

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see your app.

### Deployment to Raspberry Pi

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions on:
- Installing Docker on Raspberry Pi
- Building and running the containerized app
- Setting up kiosk mode for always-on display
- Network access configuration

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: shadcn/ui v4
- **Icons**: Phosphor Icons
- **Animations**: Framer Motion
- **State Management**: Spark KV (persistent local storage)
- **Build Tool**: Vite
- **Deployment**: Docker + Nginx

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn components
│   ├── ChoreCard.tsx    # Individual chore display
│   ├── MemberCard.tsx   # Family member stats card
│   ├── MemberAvatar.tsx # Avatar component
│   ├── ChoreDialog.tsx  # Add/edit chore modal
│   ├── MemberDialog.tsx # Add/edit member modal
│   ├── Celebration.tsx  # Completion animation
│   ├── DashboardView.tsx
│   ├── ScheduleView.tsx
│   └── ManagementView.tsx
├── lib/
│   ├── types.ts        # TypeScript interfaces
│   ├── helpers.ts      # Utility functions
│   └── utils.ts        # shadcn utilities
└── App.tsx             # Main application
```

## Usage

### Adding Family Members

1. Navigate to the **Manage** tab
2. Click **Add Member**
3. Enter name and select an avatar color
4. Click **Add Member** to save

### Creating Chores

1. From the **Dashboard** or any view, click **Add Chore**
2. Enter chore details:
   - Title (required)
   - Description (optional)
   - Frequency (daily, weekly, bi-weekly, or monthly)
   - Assign to a family member
3. Click **Add Chore** to save

### Completing Chores

Simply check the checkbox next to any chore to mark it complete. You'll see a celebration animation and the chore will be marked as done until its next due date based on the frequency.

### Viewing the Schedule

The **Schedule** tab shows a weekly calendar view of all chores organized by day, making it easy to see what's coming up.

## Customization

### Changing Colors

Edit the color variables in `src/index.css` to customize the theme:

```css
:root {
  --primary: oklch(0.65 0.15 200);    /* Main brand color */
  --secondary: oklch(0.72 0.14 25);   /* Secondary actions */
  --accent: oklch(0.85 0.15 95);      /* Highlights */
  /* ... more colors */
}
```

### Adding Fonts

Modify `index.html` to include different Google Fonts, then update the font variables in `src/index.css`.

## Kiosk Mode Features

When running in kiosk mode on a Raspberry Pi:
- Full-screen display without browser chrome
- Automatic screen wake (no blanking)
- Mouse cursor auto-hides
- Perfect for wall-mounted tablets or displays
- Auto-starts on boot

## Data Persistence

All family members and chores are stored using Spark's KV storage system, which persists data locally in the browser. Data survives page refreshes and browser restarts.

## Browser Support

- Chrome/Chromium (recommended for kiosk mode)
- Firefox
- Safari
- Edge

## License

MIT

## Contributing

This is a personal family organizer app, but feel free to fork and customize for your own needs!
