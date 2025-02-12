import { z } from "zod";

export const calculatorInputSchema = z.object({
  fleetSize: z.number().min(1, "Must have at least 1 ship"),
  voyageLength: z.number().min(1, "Voyage must be at least 1 day"),
  fuelConsumption: z.number().min(0.1, "Must consume some fuel"),
  fuelPrice: z.number().min(0.1, "Fuel price must be greater than 0"),
  estimatedSavings: z.number().min(1).max(10)
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;

export interface CalculationResult {
  totalFuelCost: number;
  estimatedSavings: number;
  fuelCostWithWayfinder: number;
  co2Reduction: number;
}
