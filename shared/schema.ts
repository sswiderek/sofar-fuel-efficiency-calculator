import { z } from "zod";

// Define vessel categories
export const vesselCategories = {
  "container-ship": "Container Ship",
  "bulk-carrier": "Bulk Carrier",
  "oil-tanker": "Tanker",
  "cruise-ship": "Cruise Ship",
  "ro-ro": "Ro-Ro / General Cargo",
  "custom": "Custom Vessel"
} as const;

// Define size options for each vessel category
export const vesselSizes = {
  "container-ship": {
    "feeder": { label: "Feeder (<1,000 TEU)", defaultConsumption: 25, defaultSeaDays: 280 },
    "feedermax": { label: "Feedermax (1,000-3,000 TEU)", defaultConsumption: 40, defaultSeaDays: 280 },
    "panamax": { label: "Panamax (3,000-5,000 TEU)", defaultConsumption: 80, defaultSeaDays: 280 },
    "postpanamax": { label: "Post-Panamax (5,000-10,000 TEU)", defaultConsumption: 150, defaultSeaDays: 280 },
    "ulcv": { label: "ULCV (>10,000 TEU)", defaultConsumption: 220, defaultSeaDays: 280 }
  },
  "bulk-carrier": {
    "small": { label: "Handysize (10000-35000 DWT)", defaultConsumption: 15, defaultSeaDays: 280 },
    "medium": { label: "Handymax (35000-50000 DWT)", defaultConsumption: 20, defaultSeaDays: 280 },
    "large": { label: "Panamax (50000-80000 DWT)", defaultConsumption: 25, defaultSeaDays: 280 },
    "vlarge": { label: "Capesize (>80000 DWT)", defaultConsumption: 30, defaultSeaDays: 280 },
    "vlcc": { label: "Bulk Carrier (VLCC)", defaultConsumption: 35, defaultSeaDays: 280 }
  },
  "oil-tanker": {
    "small": { label: "Small Tanker (<50,000 DWT)", defaultConsumption: 35, defaultSeaDays: 280 },
    "medium": { label: "Medium Tanker (50,000-80,000 DWT)", defaultConsumption: 45, defaultSeaDays: 280 },
    "aframax": { label: "Aframax (80,000-120,000 DWT)", defaultConsumption: 55, defaultSeaDays: 280 },
    "suezmax": { label: "Suezmax (120,000-160,000 DWT)", defaultConsumption: 65, defaultSeaDays: 280 },
    "vlcc": { label: "VLCC (160,000-320,000 DWT)", defaultConsumption: 85, defaultSeaDays: 280 },
    "ulcc": { label: "ULCC (>320,000 DWT)", defaultConsumption: 95, defaultSeaDays: 280 }
  },
  "cruise-ship": {
    "boutique": { label: "Boutique (<30,000 GT)", defaultConsumption: 30, defaultSeaDays: 280 },
    "premium": { label: "Premium (30,000-100,000 GT)", defaultConsumption: 50, defaultSeaDays: 280 },
    "resort": { label: "Resort (100,000-150,000 GT)", defaultConsumption: 80, defaultSeaDays: 280 },
    "mega": { label: "Mega (>150,000 GT)", defaultConsumption: 100, defaultSeaDays: 280 }
  },
  "ro-ro": {
    "small": { label: "Small / Feeder", defaultConsumption: 25, defaultSeaDays: 280 },
    "medium": { label: "Medium", defaultConsumption: 40, defaultSeaDays: 280 },
    "large": { label: "Large", defaultConsumption: 60, defaultSeaDays: 280 }
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