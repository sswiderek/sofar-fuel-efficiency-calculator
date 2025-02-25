import { Card } from "@/components/ui/card";
import { CalculationResult } from "@shared/schema";
import { DollarSign, Fuel, Info, LeafIcon, TrendingDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
                  <Info className="h-4 w-4 text-slate-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="w-[280px] p-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">How We Calculate Your Savings</h4>
                    <div className="text-sm text-slate-600 space-y-2">
                      <p>1. Your annual fuel use: {result.totalFuelConsumption.toLocaleString()} MT</p>
                      <p>2. Cost per ton: ${result.totalFuelCost/result.totalFuelConsumption}/MT</p>
                      <p>3. Total fuel cost: ${result.totalFuelCost.toLocaleString()}</p>
                      <p>4. Apply 5% optimization = ${(result.totalFuelCost * 0.05).toLocaleString()} saved per year</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="metric-value">${(result.totalFuelCost * 0.05).toLocaleString()}</div>
          <div className="metric-label">Projected cost reduction</div>
        </Card>

        <Card className="optimized-tile p-5">
          <div className="metric-header">
            <TrendingDown className="metric-icon" />
            <div className="flex items-center gap-1">
              <span>Costs Breakdown</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent className="w-[280px] p-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">How Costs Are Calculated</h4>
                    <div className="text-sm text-slate-600 space-y-2">
                      <p>1. Current Cost Calculation:</p>
                      <p className="pl-2 text-xs">• Annual fuel use (MT) × Fuel price ($/MT)</p>
                      <p className="pl-2 text-xs">• {result.totalFuelConsumption.toLocaleString()} MT × ${result.totalFuelCost/result.totalFuelConsumption}/MT</p>
                      <p className="pl-2 text-xs">• = ${result.totalFuelCost.toLocaleString()}</p>
                      <p>2. Optimized Cost Calculation:</p>
                      <p className="pl-2 text-xs">• Current cost reduced by 5%</p>
                      <p className="pl-2 text-xs">• ${result.totalFuelCost.toLocaleString()} × 0.95</p>
                      <p className="pl-2 text-xs">• = ${(result.totalFuelCost * 0.95).toLocaleString()}</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            <div className="text-sm">
              <div className="text-slate-600">Current:</div>
              <div className="text-lg font-semibold">${result.totalFuelCost.toLocaleString()}</div>
            </div>
            <div className="text-sm">
              <div className="text-slate-600">Optimized:</div>
              <div className="text-lg font-semibold">${(result.totalFuelCost * 0.95).toLocaleString()}</div>
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
              <div className="metric-value text-emerald-600">{(result.totalFuelConsumption * 0.05).toLocaleString()}</div>
              <div className="metric-label">MT CO₂ Reduction</div>
            </div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="text-sm text-slate-600">Current Usage:</div>
                <div className="text-lg font-semibold">{result.totalFuelConsumption.toLocaleString()} MT/year</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">With Wayfinder:</div>
                <div className="text-lg font-semibold text-emerald-600">
                  {Math.round(result.totalFuelConsumption * 0.95).toLocaleString()} MT/year
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}