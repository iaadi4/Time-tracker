# Contributing to Time Tracker

Thank you for your interest in contributing! This document provides guidelines for contributing to the Time Tracker extension.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/time-tracker-extension.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Building

```bash
npm run build    # Production build
npm run dev      # Development server
npm run lint     # Run ESLint
```

### Testing Changes

1. Run `npm run build`
2. Open `chrome://extensions`
3. Click the refresh icon on the extension card
4. Test your changes

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Keep components small and focused
- Use meaningful variable and function names

## Project Architecture

### Background Script (`src/background/index.ts`)

The service worker handles time tracking:

- Event-driven (wakes on tab/window events)
- Stores state in `chrome.storage.local`
- Calculates time deltas on each event

### Popup (`src/popup/index.tsx`)

The toolbar popup widget:

- Shows daily summary
- Displays top sites
- Links to full dashboard

### Dashboard (`src/dashboard/index.tsx`)

The full analytics view:

- Time range filtering
- Pie chart visualization
- Detailed site list

### Storage (`src/utils/storage.ts`)

Chrome storage utilities:

- `saveTime()` - Saves time for a domain
- `getAggregatedData()` - Retrieves aggregated stats
- `getTodayKey()` - Gets today's date key

## Pull Request Process

1. Ensure your code passes `npm run lint`
2. Update documentation if needed
3. Write a clear PR description
4. Link any related issues

## Reporting Issues

When reporting bugs, please include:

- Chrome version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

## Code of Conduct

Be respectful and constructive in all interactions.

## Questions?

Open an issue with the "question" label.
