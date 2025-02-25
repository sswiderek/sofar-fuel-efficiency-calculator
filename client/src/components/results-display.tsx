
import React from 'react';
import { Card } from "@/components/ui/card";
import { FuelIcon, DollarSign, Leaf } from "lucide-react";

interface ResultsDisplayProps {
  results: Array<{
    totalFuelCost: number;
    estimatedSavings: number;
    fuelCostWithWayfinder: number;
    co2Reduction: number;
    totalFuelConsumption: number;
    label: string;
  }>;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {results.map((result, index) => (
        <Card key={index} className="p-4">
          <h3 className="text-lg font-semibold mb-2">{result.label}</h3>
          <div className="space-y-2">
            <p>Annual Fuel Consumption: {result.totalFuelConsumption.toLocaleString()} MT</p>
            <p>Total Fuel Cost: ${result.totalFuelCost.toLocaleString()}</p>
            <p>Estimated Savings: ${result.estimatedSavings.toLocaleString()}</p>
            <p>CO2 Reduction: {result.co2Reduction.toLocaleString()} MT</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
