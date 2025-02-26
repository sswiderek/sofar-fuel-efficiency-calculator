
import { Card } from "@/components/ui/card";
import { LeafIcon } from "lucide-react";
import { CalculationResult } from "@/lib/types";

interface ResultsDisplayProps {
  result: CalculationResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-6">
        <div className="flex items-center gap-2">
          <span className="text-lg">$</span>
          <span className="text-lg font-medium">Annual Savings</span>
        </div>
        <div className="mt-4">
          <div className="text-4xl font-bold">${result.estimatedSavings.toLocaleString()}</div>
          <div className="text-blue-100 font-medium mt-1">Projected cost reduction</div>
          <p className="text-sm text-blue-200 mt-3 leading-relaxed">
            Based on your fleet's annual fuel consumption of {result.totalFuelConsumption.toLocaleString()} MT we project significant savings using Wayfinder's proven optimization technology. This conservative 5% estimate falls within our documented 4-10% efficiency improvements.
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-medium">Cost Breakdown</span>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-sm text-slate-600">Current Annual Fuel Cost:</div>
            <div className="text-2xl font-bold text-slate-900">${result.totalFuelCost.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Calculated using current VLSFO price of $1/MT × {result.totalFuelConsumption.toLocaleString()} MT annual consumption</div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Cost with Wayfinder:</div>
            <div className="text-2xl font-bold text-emerald-600">${result.fuelCostWithWayfinder.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Optimized routing and operations could reduce your annual fuel spend by ${result.estimatedSavings.toLocaleString()}</div>
          </div>
        </div>
      </Card>

      <Card className="bg-emerald-50 p-6">
        <div className="flex items-center gap-2.5 text-emerald-700">
          <LeafIcon className="h-5 w-5" />
          <span className="text-base font-medium">Environmental Impact</span>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-bold text-emerald-700">{(result.totalFuelConsumption * 0.05 * 3.11438).toFixed(0)} MT</div>
          <div className="text-emerald-700 font-medium mt-1">Annual CO₂ Reduction</div>
          <p className="text-sm text-emerald-600/90 mt-3 leading-relaxed">
            By reducing fuel consumption by {(result.totalFuelConsumption * 0.05).toFixed(0)} MT annually, your fleet could prevent {(result.totalFuelConsumption * 0.05 * 3.11438).toFixed(0)} metric tons of CO₂ emissions. This is equivalent to taking {((result.totalFuelConsumption * 0.05 * 3.11438) / 4.6).toFixed(0)} cars off the road for a year.
          </p>
        </div>
      </Card>
    </div>
  );
}
