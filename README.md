
# Sofar Ocean Wayfinder - Maritime Fuel Efficiency Calculator

An advanced maritime fuel efficiency optimization tool for Sofar Ocean's Wayfinder platform, focusing on precise fuel cost calculations and strategic fleet management through interactive data exploration.

## Features

- Real-time VLSFO (Very Low Sulfur Fuel Oil) price tracking
- Interactive vessel fleet calculator
- Estimated annual savings visualization
- CO₂ emission reduction analysis
- Shareable calculation results
- Responsive design for all devices
- Admin analytics dashboard

## Project Overview & Architecture

This application helps maritime fleet managers estimate potential fuel savings by implementing Sofar Ocean's Wayfinder platform. The calculator takes vessel fleet details, applies industry standard fuel consumption rates, and calculates annual costs and potential savings.

### Key Components

#### Vessel Calculator
- Users can add multiple vessel types to their fleet
- Each vessel has customizable parameters (size, fuel consumption, days at sea)
- Real-time validation ensures realistic inputs

#### Results Display
- Interactive charts visualize cost savings
- Detailed breakdown of fuel costs with and without Wayfinder
- CO₂ reduction estimation based on fuel savings
- Shareable results via URL encoding

#### Admin Analytics
- Tracks calculator usage statistics
- Monitors common fleet configurations
- Visualizes user engagement metrics

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   │   ├── calculator/  # Main calculator components
│   │   │   ├── results-display.tsx  # Results visualization
│   │   │   └── ui/  # Shadcn/UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and API clients
│   │   └── pages/       # Route components
├── server/              # Backend Express server
│   ├── cache/           # Price cache storage
│   ├── services/        # Business logic services
│   └── routes.ts        # API endpoint definitions
├── shared/              # Shared TypeScript types
└── public/              # Static assets
```

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI, Radix UI
- **Backend**: Express.js, Node.js
- **Data Visualization**: Recharts for interactive charts
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Query for data fetching
- **Build System**: Vite for fast development

## Implementation Guide

### 1. Setting Up the Project

1. **Clone the repository or extract the ZIP file**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5000

### 2. Key Implementation Details

#### Real-time Calculator
The calculator uses controlled components with React Hook Form:
```tsx
// Example from vessel-form.tsx
const form = useForm<VesselFormValues>({
  resolver: zodResolver(vesselSchema),
  defaultValues: initialValues
});

// Real-time calculation updates with watch
const values = form.watch();
useEffect(() => {
  // Update calculations as values change
}, [values]);
```

#### Shareable Results
Results can be shared via URL encoding:
```tsx
// Creates a shareable link with encoded calculation data
const handleShare = () => {
  const shareData = {
    version: "1.0",
    vessels: result.vessels,
    fuelPrice: result.fuelPrice,
    // Additional data
  };
  
  // Convert to base64 URL-friendly string
  const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
  const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
  
  // Copy to clipboard
  navigator.clipboard.writeText(url);
};
```

#### Price Data Fetching
The application fetches the latest VLSFO prices:
```tsx
// Example from fuel-price-display.tsx
const { data: priceData, isLoading } = useQuery({
  queryKey: ['/api/vlsfo-price'],
  refetchOnWindowFocus: false,
});
```

### 3. Customization Options

- **Vessel Types**: Add new vessel categories in `vessel-types.ts`
- **Calculation Logic**: Modify the savings algorithm in `calculator-service.ts`
- **UI Components**: Customize the look and feel via Tailwind classes and shadcn/ui components
- **Theme**: Adjust the color scheme in `theme.json`

## Deployment

### Deploying to Replit

1. Fork the project on Replit
2. Click "Run" to start the development server
3. For production deployment, use the "Deploy" button in the Replit interface

### Deploying to Other Platforms

1. Build the project:
   ```bash
   npm run build
   ```

2. The production files will be in the `dist` directory
3. Deploy these files to your hosting platform of choice

## Sharing Options

### Option 1: Share the Deployed App

Share your deployed app URL with users so they can interact with the calculator directly.

### Option 2: Share Calculation Results

When viewing calculation results, click the "Share Results" button to generate a shareable link that contains all calculation data. Recipients can view the same results by visiting the link.

### Option 3: Share the Code

- **GitHub**: Push to a GitHub repository for collaborative development
- **ZIP File**: Share this codebase as a ZIP file for others to run locally
- **Replit**: Share your Replit project URL for others to fork and modify

## API Endpoints

- `GET /api/vlsfo-price`: Get current VLSFO fuel price with monthly data
- `POST /api/analytics/record`: Record calculator usage analytics
- `GET /api/analytics/data`: Retrieve analytics data (admin only)

## License

MIT
