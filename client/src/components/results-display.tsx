
import React from 'react';
import { Card } from "@/components/ui/card";

interface ResultsDisplayProps {
  results: {
    totalFuelCost: number;
    estimatedSavings: number;
    fuelCostWithWayfinder: number;
    co2Reduction: number;
    totalFuelConsumption: number;
  };
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
    <div className="grid gap-4">
      <Card className="p-4">
        <div className="space-y-2">
          <p>Current Annual Costs: ${results.totalFuelCost.toLocaleString()}</p>
          <p>Optimized Cost: ${results.fuelCostWithWayfinder.toLocaleString()}</p>
          <p>Estimated Savings: ${results.estimatedSavings.toLocaleString()}</p>
          <p>CO2 Reduction: {results.co2Reduction.toLocaleString()} MT</p>
        </div>
      </Card>
    </div>
  );
}
