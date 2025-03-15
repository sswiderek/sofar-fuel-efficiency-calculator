import { z } from "zod";

// Define vessel categories
export const vesselCategories = {
  "container-ship": "Container Ship",
  "bulk-carrier": "Bulk Carrier",
  "oil-tanker": "Oil Tanker",
  "chemical-tanker": "Chemical Tanker",
  "ro-ro": "Ro-Ro Carrier",
  "ore-carrier": "Ore Carrier",
  "custom": "Custom Vessel"
} as const;

// Define size options for each vessel category
export const vesselSizes = {
  "container-ship": {
    "feeder": { label: "Feeder (<1,000 TEU)", defaultConsumption: 25, defaultSeaDays: 280 },
    "small": { label: "Small Feeder (1,000-2,000 TEU)", defaultConsumption: 40, defaultSeaDays: 280 },
    "medium": { label: "Panamax (3,000-5,000 TEU)", defaultConsumption: 80, defaultSeaDays: 280 },
    "large": { label: "Post-Panamax (5,000-10,000 TEU)", defaultConsumption: 150, defaultSeaDays: 280 },
    "vlarge": { label: "ULCV (>10,000 TEU)", defaultConsumption: 220, defaultSeaDays: 280 }
  },
  "bulk-carrier": {
    "small": { label: "Handysize (10000-35000 DWT)", defaultConsumption: 25, defaultSeaDays: 280 },
    "medium": { label: "Handymax (35000-50000 DWT)", defaultConsumption: 30, defaultSeaDays: 280 },
    "large": { label: "Panamax (50000-80000 DWT)", defaultConsumption: 40, defaultSeaDays: 280 },
    "vlarge": { label: "Capesize (>80000 DWT)", defaultConsumption: 60, defaultSeaDays: 280 }
  },
  "oil-tanker": {
    "small": { label: "MR (25000-45000 DWT)", defaultConsumption: 35, defaultSeaDays: 280 },
    "medium": { label: "LR1 (45000-80000 DWT)", defaultConsumption: 45, defaultSeaDays: 280 },
    "large": { label: "LR2 (80000-160000 DWT)", defaultConsumption: 65, defaultSeaDays: 280 },
    "vlarge": { label: "VLCC (>160000 DWT)", defaultConsumption: 90, defaultSeaDays: 280 }
  },
  "chemical-tanker": {
    "small": { label: "Small (5,000-10,000 DWT)", defaultConsumption: 25, defaultSeaDays: 280 },
    "medium": { label: "Medium (10,000-20,000 DWT)", defaultConsumption: 35, defaultSeaDays: 280 },
    "large": { label: "Large (20,000-40,000 DWT)", defaultConsumption: 45, defaultSeaDays: 280 },
    "vlarge": { label: "Very Large (40,000+ DWT)", defaultConsumption: 55, defaultSeaDays: 280 }
  },
  "ro-ro": {
    "small": { label: "Small RORO (up to 1,000 CEU)", defaultConsumption: 30, defaultSeaDays: 280 },
    "medium": { label: "Medium RORO (1,000-4,000 CEU)", defaultConsumption: 45, defaultSeaDays: 280 },
    "large": { label: "Large RORO (4,000-6,000 CEU)", defaultConsumption: 60, defaultSeaDays: 280 },
    "vlarge": { label: "VLCC RORO (6,000+ CEU)", defaultConsumption: 75, defaultSeaDays: 280 }
  },
  "ore-carrier": {
    "small": { label: "Handysize (10,000-35,000 DWT)", defaultConsumption: 30, defaultSeaDays: 280 },
    "medium": { label: "Panamax (60,000-80,000 DWT)", defaultConsumption: 45, defaultSeaDays: 280 },
    "large": { label: "Capesize (100,000-200,000 DWT)", defaultConsumption: 65, defaultSeaDays: 280 },
    "vlarge": { label: "VLOC (200,000+ DWT)", defaultConsumption: 85, defaultSeaDays: 280 }
  },
  "custom": {
    "custom": { label: "Custom Size", defaultConsumption: 50, defaultSeaDays: 280 }
  }
} as const;

export const vesselSchema = z.object({
  category: z.enum(Object.keys(vesselCategories) as [string, ...string[]]),
  size: z.string(),
  count: z.number().min(1, "Must have at least 1 ship"),
  fuelConsumption: z.number().min(0.1, "Must consume some fuel"),
  seaDaysPerYear: z.number().min(1, "Must have at least 1 sea day").max(365, "Cannot exceed 365 days per year"),
  buildYear: z.number().optional(),
  specificsProvided: z.boolean().optional()
});

export const calculatorInputSchema = z.object({
  vessels: z.array(vesselSchema),
  fuelPrice: z.number().min(0.1, "Fuel price must be greater than 0").max(5000, "Please verify prices over $5000/MT"),
  estimatedSavings: z.number().min(0).max(10)
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;
export type Vessel = z.infer<typeof vesselSchema>;

export interface CalculationResult {
  totalFuelCost: number;
  estimatedSavings: number;
  fuelCostWithWayfinder: number;
  co2Reduction: number;
  totalFuelConsumption: number;
  fuelPrice: number;
  vessels: Vessel[];
}