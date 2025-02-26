
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card className="p-4 bg-white/90">
        <h3 className="text-lg font-semibold mb-2">Annual Fuel Costs</h3>
        <div className="space-y-2">
          <div>
            <span className="text-slate-600">Current: </span>
            <span className="font-medium">${formatNumber(results.totalFuelCost)}</span>
          </div>
          <div>
            <span className="text-slate-600">With Wayfinder: </span>
            <span className="font-medium text-emerald-600">${formatNumber(results.fuelCostWithWayfinder)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-white/90">
        <h3 className="text-lg font-semibold mb-2">Potential Savings</h3>
        <div className="space-y-2">
          <div>
            <span className="text-slate-600">Annual Savings: </span>
            <span className="font-medium text-emerald-600">${formatNumber(results.estimatedSavings)}</span>
          </div>
          <div>
            <span className="text-slate-600">CO₂ Reduction: </span>
            <span className="font-medium text-emerald-600">{formatNumber(results.co2Reduction)} MT</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
