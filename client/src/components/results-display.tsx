import { Card } from "@/components/ui/card";
import { CalculationResult } from "@shared/schema";
import { DollarSign, Fuel, LeafIcon, TrendingDown } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"; // Assuming these components exist
import { InfoIcon } from "@/components/ui/icons"; // Assuming this component exists


interface ResultsDisplayProps {
  results: CalculationResult[] | null;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results || results.length === 0) return null;

  const result = results[0];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Analysis Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="savings-tile p-5">
          <div className="metric-header">
            <DollarSign className="metric-icon" />
            <div className="flex items-center gap-2">
              <span>Annual Savings</span>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-4 h-4 text-slate-600" />
                </TooltipTrigger>
                <TooltipContent className="w-[280px] p-3">
                  <h4 className="font-medium mb-2">Here's how we calculate your savings:</h4>
                  <ol className="text-sm space-y-2 list-decimal list-outside ml-4">
                    <li>We first calculate how many days your ships spend at sea annually, accounting for port time</li>
                    <li>Then multiply by your fleet size, daily fuel usage, and fuel price</li>
                    <li>Finally, apply the optimization level ({result.savingsPercent}%) to find potential savings</li>
                  </ol>
                </TooltipContent>
              </Tooltip>
            </div>
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