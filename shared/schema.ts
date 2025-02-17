import { z } from "zod";

export const calculatorInputSchema = z.object({
  fleetSize: z.number().min(1, "Must have at least 1 ship").max(1000, "Please verify fleet size over 1000"),
  voyageLength: z.number().min(1, "Voyage must be at least 1 day").max(365, "Please verify voyages over 365 days"),
  portTimePerVoyage: z.number().min(0, "Port time cannot be negative").max(30, "Please verify port times over 30 days"),
  fuelConsumption: z.number().min(0.1, "Must consume some fuel").max(1000, "Please verify consumption over 1000 MT/day"),
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
