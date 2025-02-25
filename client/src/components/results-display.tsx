
import { Card } from "@/components/ui/card";
import { CalculationResult } from "@shared/schema";

interface ResultsDisplayProps {
  results: CalculationResult[] | null;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results || results.length === 0) return null;
  
  // Display first result
  const result = results[0];
  
  return (
    <div className="grid gap-4">
      <Card className="p-4">
        <div className="space-y-2">
          <p>Current Annual Costs: ${result.totalFuelCost.toLocaleString()}</p>
          <p>Optimized Cost: ${result.fuelCostWithWayfinder.toLocaleString()}</p>
          <p>Estimated Savings: ${result.estimatedSavings.toLocaleString()}</p>
          <p>CO2 Reduction: {result.co2Reduction.toLocaleString()} MT</p>
          <p>Annual Fuel Consumed: {result.totalFuelConsumption.toLocaleString()} MT</p>
        </div>
      </Card>
    </div>
  );
}
