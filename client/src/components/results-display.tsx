
import React from 'react';
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { type CalculationResult } from "@shared/schema";

type ResultsDisplayProps = {
  results: CalculationResult | null;
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-white/90 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Annual Fuel Costs</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Current Fuel Cost:</span>
            <span className="font-medium text-lg">${formatNumber(results.totalFuelCost)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">With Wayfinder:</span>
            <span className="font-medium text-lg text-emerald-600">${formatNumber(results.fuelCostWithWayfinder)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-slate-600">Annual Fuel Consumption:</span>
            <span className="font-medium">{formatNumber(results.totalFuelConsumption)} MT</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/90 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Potential Impact</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Annual Savings:</span>
            <span className="font-medium text-lg text-emerald-600">${formatNumber(results.estimatedSavings)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">CO₂ Reduction:</span>
            <span className="font-medium text-lg text-emerald-600">{formatNumber(results.co2Reduction)} MT</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-slate-600">Fuel Reduction:</span>
            <span className="font-medium">{formatNumber(results.fuelReduction)} MT</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
