
import { Card } from "@/components/ui/card";
import { CalculationResult } from "@shared/schema";
import { DollarSign, Info, LeafIcon, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ResultsDisplayProps {
  results: CalculationResult[] | null;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results || results.length === 0) return null;

  const result = results[0];

  return (
    <div className="max-w-4xl w-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Analysis Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="savings-tile col-span-full md:col-span-2 xl:col-span-1 p-6 relative overflow-hidden">
          <div className="metric-header">
            <DollarSign className="metric-icon" />
            <span>Annual Savings</span>
          </div>
          <div className="metric-value">${(result.totalFuelCost * 0.05).toLocaleString()}</div>
          <div className="metric-label">Projected cost reduction</div>
          <div className="waves-small"></div>
        </Card>

        <Card className="optimized-tile p-6">
          <div className="metric-header">
            <TrendingDown className="metric-icon" />
            <span>Costs Breakdown</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-[250px] space-y-2">
                  <h4 className="font-medium">Cost Calculation</h4>
                  <div className="text-sm text-slate-600">
                    <p>Based on:</p>
                    <p className="pl-2 text-xs">• Annual fuel usage</p>
                    <p className="pl-2 text-xs">• Current market prices</p>
                    <p className="pl-2 text-xs">• 5% optimization savings</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="text-sm text-slate-600">Current:</div>
              <div className="text-xl font-semibold">${result.totalFuelCost.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Optimized:</div>
              <div className="text-xl font-semibold">${(result.totalFuelCost * 0.95).toLocaleString()}</div>
            </div>
          </div>
        </Card>

        <Card className="co2-tile p-6">
          <div className="metric-header">
            <LeafIcon className="metric-icon text-emerald-600" />
            <span>Environmental Impact</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-[250px] space-y-2">
                  <h4 className="font-medium">CO₂ Emissions</h4>
                  <div className="text-sm text-slate-600">
                    <p>Calculations based on:</p>
                    <p className="pl-2 text-xs">• 1 MT of fuel produces ~3.1 MT of CO₂</p>
                    <p className="pl-2 text-xs">• Reduction based on optimized fuel consumption</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-emerald-600">{Math.round(result.totalFuelConsumption * 0.05).toLocaleString()}</div>
            <div className="text-sm text-slate-600">MT CO₂ Reduction</div>
            <div className="mt-4 space-y-2">
              <div>
                <div className="text-sm text-slate-600">Current Usage:</div>
                <div className="text-lg font-medium">{result.totalFuelConsumption.toLocaleString()} MT/year</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">With Wayfinder:</div>
                <div className="text-lg font-medium">{(result.totalFuelConsumption * 0.95).toLocaleString()} MT/year</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
