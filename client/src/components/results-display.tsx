
import { Card } from "@/components/ui/card";
import { CalculationResult } from "@shared/schema";
import { DollarSign, Fuel, LeafIcon, TrendingDown } from "lucide-react";

interface ResultsDisplayProps {
  results: CalculationResult[] | null;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results || results.length === 0) return null;
  
  const result = results[0];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Analysis Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="savings-tile p-5">
          <div className="metric-header">
            <DollarSign className="metric-icon" />
            <span>Annual Savings</span>
          </div>
          <div className="metric-value">${result.estimatedSavings.toLocaleString()}</div>
          <div className="metric-label">Projected cost reduction</div>
        </Card>

        <Card className="optimized-tile p-5">
          <div className="metric-header">
            <TrendingDown className="metric-icon" />
            <span>Costs Breakdown</span>
          </div>
          <div className="space-y-2 mt-2">
            <div className="text-sm">
              <div className="text-slate-600">Current:</div>
              <div className="text-lg font-semibold">${result.totalFuelCost.toLocaleString()}</div>
            </div>
            <div className="text-sm">
              <div className="text-slate-600">Optimized:</div>
              <div className="text-lg font-semibold">${result.fuelCostWithWayfinder.toLocaleString()}</div>
            </div>
          </div>
        </Card>

        <Card className="co2-tile p-5">
          <div className="metric-header">
            <LeafIcon className="metric-icon text-emerald-600" />
            <span>Environmental Impact</span>
          </div>
          <div className="space-y-2 mt-2">
            <div>
              <div className="metric-value text-emerald-600">{result.co2Reduction.toLocaleString()}</div>
              <div className="metric-label">MT CO₂ Reduction</div>
            </div>
            <div className="mt-3">
              <div className="text-lg font-semibold">{result.totalFuelConsumption.toLocaleString()}</div>
              <div className="text-xs text-slate-500">MT Annual Fuel Usage</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
