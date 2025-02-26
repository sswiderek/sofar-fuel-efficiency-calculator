import { Card } from "@/components/ui/card";
import { CalculationResult } from "@shared/schema";
import { DollarSign, Info, LeafIcon } from "lucide-react";
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
            <div className="text-white/80 text-sm max-w-[240px] flex items-center h-full leading-snug">
              Based on your fleet's annual fuel consumption of {result.totalFuelConsumption.toLocaleString()} MT, we project significant savings using Wayfinder's proven optimization technology. This conservative 5% estimate falls within our documented 4-10% efficiency improvements.
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-slate-700">
            <Info className="h-5 w-5" />
            <span className="text-base font-medium">Cost Breakdown</span>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">Current Annual Fuel Cost:</div>
              <div className="font-semibold">${result.totalFuelCost.toLocaleString()}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">Cost with Wayfinder:</div>
              <div className="font-semibold text-emerald-600">${result.fuelCostWithWayfinder.toLocaleString()}</div>
            </div>
            <div className="text-sm text-slate-500">
              Optimized routing and operations could reduce your annual fuel spend by ${(result.totalFuelCost * 0.05).toLocaleString()}
            </div>
          </div>
        </Card>

        <Card className="p-6 border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-700">
            <LeafIcon className="h-5 w-5" />
            <span className="text-base font-medium">Environmental Impact</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 mt-3">{result.co2Reduction.toLocaleString()} MT</div>
          <div className="text-sm text-slate-600 mt-1">Annual CO₂ Reduction</div>
          <div className="text-sm text-slate-500 mt-3">
            By reducing fuel consumption by {result.totalFuelConsumption * 0.05} MT annually, your fleet could prevent {result.co2Reduction.toLocaleString()} metric tons of CO₂ emissions. This is equivalent to taking {Math.round(result.co2Reduction / 4.6)} cars off the road for a year.
          </div>
        </Card>
      </div>
    </div>
  );
}