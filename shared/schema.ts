import { z } from "zod";

export const vesselTypes = {
  "container-ship-small": { label: "Container Ship (Feeder <3000 TEU)", defaultConsumption: 40 },
  "container-ship-medium": { label: "Container Ship (Panamax 3000-5000 TEU)", defaultConsumption: 80 },
  "container-ship-large": { label: "Container Ship (Post-Panamax >5000 TEU)", defaultConsumption: 150 },
  "bulk-carrier-small": { label: "Bulk Carrier (Handysize)", defaultConsumption: 25 },
  "bulk-carrier-large": { label: "Bulk Carrier (Panamax)", defaultConsumption: 40 },
  "tanker-small": { label: "Oil Tanker (Medium Range)", defaultConsumption: 35 },
  "tanker-large": { label: "Oil Tanker (VLCC)", defaultConsumption: 90 },
  "custom": { label: "Custom Vessel Type", defaultConsumption: 50 },
} as const;

export const vesselSchema = z.object({
  type: z.enum(Object.keys(vesselTypes) as [string, ...string[]]),
  count: z.number().min(1, "Must have at least 1 ship"),
  fuelConsumption: z.number().min(0.1, "Must consume some fuel"),
  seaDaysPerYear: z.number().min(1, "Must have at least 1 sea day").max(365, "Cannot exceed 365 days per year")
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