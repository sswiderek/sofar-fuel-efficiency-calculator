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
    <div className="max-w-4xl space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Analysis Results</h2>
      <div className="grid gap-4">
        <Card className="bg-gradient-to-br from-[#0E6396] to-[#0A4F78] text-white p-6">
          <div className="flex items-center gap-2.5 text-white/90">
            <DollarSign className="h-5 w-5" />
            <span className="text-base font-medium">Annual Savings</span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="text-4xl font-bold mt-3 tracking-tight">${(result.totalFuelCost * 0.05).toLocaleString()}</div>
              <div className="text-sm text-white/90 mt-1">Projected cost reduction</div>
            </div>
            <div className="text-white/80 text-xs max-w-[180px] flex items-center h-full">
              Using a conservative 5% of Wayfinder's proven 4-10% fuel savings, your fleet consuming {result.totalFuelConsumption.toLocaleString()} MT of fuel annually could save:
            </div>
          </div>
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
            <div className="flex gap-36">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-sm text-slate-600">Current:</div>
                  <div className="text-xl font-semibold">${result.totalFuelCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">With Wayfinder:</div>
                  <div className="text-xl font-semibold">${(result.totalFuelCost * 0.95).toLocaleString()}</div>
                </div>
              </div>
              <div className="text-slate-600 text-xs max-w-[240px] flex items-start -mt-10">
                <div>
                  Here's how we calculate your optimized costs:
                  <ul className="list-disc mt-1 ml-3 space-y-1">
                    <li>Start with your current annual fuel costs</li>
                    <li>Apply Wayfinder's proven 5% efficiency improvement</li>
                    <li>This reduction comes from optimized routing and operational improvements</li>
                  </ul>
                </div>
              </div>
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
              <div className="text-slate-600 text-xs max-w-[180px] ml-4">
                Calculation: Current consumption × 0.95 (5% reduction) × 3.15 (IMO CO₂ factor per MT fuel)
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}