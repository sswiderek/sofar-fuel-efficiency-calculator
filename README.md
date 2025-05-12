
# Sofar Ocean Wayfinder - Maritime Fuel Efficiency Calculator

An advanced maritime fuel efficiency optimization tool for Sofar Ocean's Wayfinder platform, focusing on precise fuel cost calculations and strategic fleet management through interactive data exploration.

![Maritime Fuel Calculator](https://maritime-fuel-calculator.replit.app/banner.png)

## Features

- Real-time VLSFO (Very Low Sulfur Fuel Oil) price tracking
- Interactive vessel fleet calculator
- Estimated annual savings visualization
- CO₂ emission reduction analysis
- Shareable calculation results
- Responsive design for all devices
- Admin analytics dashboard

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   └── pages/       # Page components
├── server/              # Backend Express server
│   ├── cache/           # Price cache storage
│   ├── services/        # Backend services
│   └── routes.ts        # API routes
├── shared/              # Shared TypeScript types
└── public/              # Static assets
```

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI, Radix UI
- **Backend**: Express.js, Node.js
- **Data Visualization**: Recharts
- **Form Handling**: React Hook Form, Zod validation
- **API Integration**: OpenAI API for fuel price predictions
- **Build System**: Vite
- **State Management**: React Query

## Installation & Setup

1. **Clone the repository or extract the ZIP file**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory with:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5000

5. **Build for production**:
   ```bash
   npm run build
   ```

## Sharing the App

### Option 1: Share the Deployed App

Access the live version at: https://maritime-fuel-calculator.replit.app/
Users can interact with the calculator and view results without installation.

### Option 2: Share Calculation Results

When viewing calculation results, click the "Share Results" button to generate a shareable link that contains all calculation data. Recipients can view the same results by visiting the link.

### Option 3: Share the Code

- **GitHub**: Push to a GitHub repository for collaborative development
- **ZIP File**: Share this ZIP file for others to run locally
- **Replit**: Share your Replit project URL for others to fork and modify

## API Endpoints

- `GET /api/vlsfo-price`: Get current VLSFO fuel price with monthly data
- `POST /api/analytics/record`: Record calculator usage analytics
- `GET /api/analytics/data`: Retrieve analytics data (admin only)

## License

MIT
