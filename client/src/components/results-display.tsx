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
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Analysis Results</h2>
      <div className="space-y-3">
        <Card className="bg-[#0E6396] text-white p-4">
          <div className="flex items-center gap-2 text-white/90">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Annual Savings</span>
          </div>
          <div className="text-2xl font-bold mt-2">${(result.totalFuelCost * 0.05).toLocaleString()}</div>
          <div className="text-xs text-white/90">Projected cost reduction</div>
        </Card>

        <Card className="bg-white p-3.5">
          <div className="flex items-center gap-2 text-slate-700">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">Costs Breakdown</span>
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

        <Card className="bg-emerald-50 p-3.5">
          <div className="flex items-center gap-2">
            <LeafIcon className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">Environmental Impact</span>
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