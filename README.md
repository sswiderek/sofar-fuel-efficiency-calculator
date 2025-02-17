
# Maritime Fuel Calculator Web App

A React-based web application for calculating maritime fuel savings with real-time VLSFO price data.

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── pages/      # Page components
├── server/              # Backend Express server
│   ├── cache/          # Price cache storage
│   ├── services/       # Backend services
│   └── routes.ts       # API routes
├── shared/             # Shared TypeScript types
└── public/             # Static assets
```

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS, Radix UI
- Backend: Express.js, Node.js
- Build Tools: Vite
- Styling: TailwindCSS, shadcn/ui components

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Environment Variables

Required environment variables:
- `OPENAI_API_KEY`: For price prediction service
- `DATABASE_URL`: Database connection string (if applicable)

## API Endpoints

- `GET /api/vlsfo-price`: Get current VLSFO fuel price
- Additional endpoints documented in server/routes.ts

## License

MIT
