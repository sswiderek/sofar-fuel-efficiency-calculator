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
  const annualSavings = result.totalFuelCost * 0.05;
  const co2Reduction = result.totalFuelConsumption * 0.05 * 3.11438;
  const carsOffRoad = co2Reduction / 4.6;

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
              <div className="text-4xl font-bold mt-3 tracking-tight">${annualSavings.toLocaleString()}</div>
              <div className="text-sm text-white/90 mt-1">Projected cost reduction</div>
            </div>
            <div className="text-white/80 text-sm max-w-[240px] flex items-center h-full leading-snug">
              Based on your fleet's annual fuel consumption of {result.totalFuelConsumption.toLocaleString()} MT, we project significant savings using Wayfinder's proven optimization technology. This conservative 5% estimate falls within our documented 4-10% efficiency improvements.
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6">
          <div className="flex items-center gap-2 text-slate-700">
            <Info className="h-5 w-5" />
            <span className="text-base font-medium">Cost Breakdown</span>
          </div>
          <div className="mt-6">
            <div>
              <div className="text-sm text-slate-600 mb-1">Current Annual Fuel Cost:</div>
              <div className="text-3xl font-bold tracking-tight">${result.totalFuelCost.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-2">
                Calculated using current VLSFO price of ${result.fuelPrice}/MT × {result.totalFuelConsumption} MT annual consumption
              </div>
            </div>
            <div className="h-px bg-slate-200 my-8" />
            <div>
              <div className="text-sm text-slate-600 mb-1">Cost with Wayfinder:</div>
              <div className="text-3xl font-bold tracking-tight text-emerald-600">${(result.totalFuelCost - annualSavings).toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-2">
                Optimized routing and operations could reduce your annual fuel spend by ${annualSavings.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-emerald-50 p-6">
          <div className="flex items-center gap-2.5 text-emerald-700">
            <LeafIcon className="h-5 w-5" />
            <span className="text-base font-medium">Environmental Impact</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-emerald-700">{Math.round(co2Reduction).toLocaleString()} MT</div>
            <div className="text-emerald-700 font-medium mt-1">Annual CO₂ Reduction</div>
            <p className="text-sm text-emerald-600/90 mt-3 leading-relaxed">
              By reducing fuel consumption by {(result.totalFuelConsumption * 0.05).toFixed(0)} MT annually, your fleet could prevent {Math.round(co2Reduction).toLocaleString()} metric tons of CO₂ emissions. This is equivalent to taking {Math.round(carsOffRoad).toLocaleString()} cars off the road for a year.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}