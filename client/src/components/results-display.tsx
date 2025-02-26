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
  const annualSavings = result.estimatedSavings;
  const co2Reduction = result.co2Reduction;
  const carsOffRoad = co2Reduction / 4.6;

  return (
    <div className="max-w-4xl space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Analysis Results</h2>
      <div className="grid gap-4">
        <Card className="bg-gradient-to-br from-[#0E6396] to-[#0A4F78] text-white p-4">
          <div className="flex items-center gap-2 text-white/90">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Annual Savings</span>
          </div>
          <div className="flex justify-between items-start gap-3">
            <div>
              <div className="text-2xl font-bold mt-2 tracking-tight">${result.estimatedSavings.toLocaleString()}</div>
              <div className="text-xs text-white/90">Projected cost reduction</div>
            </div>
            <div className="text-white/80 text-[0.7rem] max-w-[200px] flex items-center h-full leading-snug">
              Based on your fleet's annual fuel consumption of {result.totalFuelConsumption.toLocaleString()} MT, we project significant savings using Wayfinder's proven optimization technology.
            </div>
          </div>
        </Card>

        <Card className="bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <LeafIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Environmental Impact</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700">{Math.round(co2Reduction).toLocaleString()} MT</div>
            <div className="text-emerald-700 font-medium text-sm">Annual CO₂ Reduction</div>
            <p className="text-[0.7rem] text-emerald-600/90 mt-2 leading-relaxed">
              Reducing fuel by {(result.totalFuelConsumption * 0.05).toFixed(0)} MT annually prevents {Math.round(co2Reduction).toLocaleString()} MT of CO₂ emissions, equivalent to {Math.round(carsOffRoad).toLocaleString()} cars off the road yearly.
            </p>
          </div>
        </Card>

        <Card className="bg-white p-6">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="rounded-full p-1 bg-slate-100">
              <Info className="h-4 w-4" />
            </div>
            <span className="text-base font-medium">Cost Breakdown</span>
          </div>
          <div className="mt-4">
            <div>
              <div className="text-sm text-slate-600">Current Annual Fuel Cost:</div>
              <div className="text-2xl font-bold tracking-tight">${result.totalFuelCost.toLocaleString()}</div>
              <div className="text-[0.7rem] text-slate-500">
                VLSFO price: ${(result.fuelPrice || 0).toLocaleString()}/MT × {(result.totalFuelConsumption || 0).toLocaleString()} MT annual consumption
              </div>
            </div>
            <div className="h-[1px] bg-slate-200 my-3" />
            <div>
              <div className="text-sm text-slate-600">Cost with Wayfinder:</div>
              <div className="text-2xl font-bold tracking-tight text-emerald-600">${(result.totalFuelCost - annualSavings).toLocaleString()}</div>
              <div className="text-[0.7rem] text-slate-500">
                Optimized routing and operations could reduce your annual fuel spend by ${annualSavings.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}