import { z } from "zod";

export const vesselTypes = {
  // Container Ships - More detailed breakdown
  "container-ship-feeder": { label: "Container Ship (Feeder <1000 TEU)", defaultConsumption: 25, defaultSeaDays: 280 },
  "container-ship-small": { label: "Container Ship (Small Feeder 1000-2000 TEU)", defaultConsumption: 40, defaultSeaDays: 280 },
  "container-ship-medium": { label: "Container Ship (Panamax 3000-5000 TEU)", defaultConsumption: 80, defaultSeaDays: 280 },
  "container-ship-large": { label: "Container Ship (Post-Panamax 5000-10000 TEU)", defaultConsumption: 150, defaultSeaDays: 280 },
  "container-ship-vlarge": { label: "Container Ship (ULCV >10000 TEU)", defaultConsumption: 220, defaultSeaDays: 280 },
  
  // Bulk Carriers - More detailed breakdown
  "bulk-carrier-small": { label: "Bulk Carrier (Handysize 10000-35000 DWT)", defaultConsumption: 25, defaultSeaDays: 280 },
  "bulk-carrier-medium": { label: "Bulk Carrier (Handymax 35000-50000 DWT)", defaultConsumption: 30, defaultSeaDays: 280 },
  "bulk-carrier-large": { label: "Bulk Carrier (Panamax 50000-80000 DWT)", defaultConsumption: 40, defaultSeaDays: 280 },
  "bulk-carrier-vlarge": { label: "Bulk Carrier (Capesize >80000 DWT)", defaultConsumption: 60, defaultSeaDays: 280 },
  
  // Oil Tankers - More detailed breakdown
  "tanker-small": { label: "Oil Tanker (MR 25000-45000 DWT)", defaultConsumption: 35, defaultSeaDays: 280 },
  "tanker-medium": { label: "Oil Tanker (LR1 45000-80000 DWT)", defaultConsumption: 45, defaultSeaDays: 280 },
  "tanker-large": { label: "Oil Tanker (LR2 80000-160000 DWT)", defaultConsumption: 65, defaultSeaDays: 280 },
  "tanker-vlarge": { label: "Oil Tanker (VLCC >160000 DWT)", defaultConsumption: 90, defaultSeaDays: 280 },
  
  // Custom option for special cases
  "custom": { label: "Custom Vessel Type", defaultConsumption: 50, defaultSeaDays: 280 },
} as const;

export const vesselSchema = z.object({
  type: z.enum(Object.keys(vesselTypes) as [string, ...string[]]),
  count: z.number().min(1, "Must have at least 1 ship"),
  fuelConsumption: z.number().min(0.1, "Must consume some fuel"),
  seaDaysPerYear: z.number().min(1, "Must have at least 1 sea day").max(365, "Cannot exceed 365 days per year"),
  // Optional additional specifications
  capacity: z.number().optional(),
  enginePower: z.number().optional(),
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