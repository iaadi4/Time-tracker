# Contributing to Time Tracker

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/time-tracker-extension.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development

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

## Project Architecture

```
src/
├── background/index.ts      # Service worker (event-driven tracking)
├── dashboard/
│   ├── index.tsx            # Main dashboard
│   └── components/          # UI components
├── popup/index.tsx          # Toolbar popup
├── utils/
│   ├── storage.ts           # Chrome storage API
│   ├── types.ts             # TypeScript types
│   └── format.ts            # Formatting utilities
```

### Key Files

- **background/index.ts** - Handles tab/window events, calculates time deltas
- **utils/storage.ts** - `saveTime()`, `getSettings()`, `getAggregatedData()`
- **dashboard/components/** - Reusable UI: StatCard, ActivityList, DistributionChart

## Code Style

- Use TypeScript for all new code
- Follow existing patterns
- Keep components small and focused
- Use meaningful names

## Pull Request Process

1. Ensure `npm run lint` passes
2. Update documentation if needed
3. Write a clear PR description

## Reporting Issues

Include:

- Chrome version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

## Questions?

Open an issue with the "question" label.
