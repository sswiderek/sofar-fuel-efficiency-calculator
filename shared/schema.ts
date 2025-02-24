
import { z } from "zod";

export const vesselSchema = z.object({
  type: z.string(),
  count: z.number().min(1, "Must have at least 1 ship"),
  fuelConsumption: z.number().min(0.1, "Must consume some fuel")
});

export const calculatorInputSchema = z.object({
  vessels: z.array(vesselSchema),
  annualSeaDays: z.number().min(1, "Must have at least 1 sea day").max(365, "Cannot exceed 365 days per year"),
  fuelPrice: z.number().min(0.1, "Fuel price must be greater than 0").max(5000, "Please verify prices over $5000/MT"),
  estimatedSavings: z.number().min(0).max(10)
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;

export interface CalculationResult {
  totalFuelCost: number;
  estimatedSavings: number;
  fuelCostWithWayfinder: number;
  co2Reduction: number;
  totalFuelConsumption: number;
}
