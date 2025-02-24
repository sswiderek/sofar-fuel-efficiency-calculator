import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DollarSign, Leaf as LeafIcon } from "lucide-react";
import { SmartTooltip } from "./smart-tooltip";
import { TooltipContent } from "./ui/tooltip";
import type { CalculationResult } from "@shared/schema";

interface ResultsDisplayProps {
  results: CalculationResult[];
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const baseResult = results[0];
  const {
    totalFuelCost,
    estimatedSavings,
    fuelCostWithWayfinder,
    co2Reduction,
    totalFuelConsumption
  } = baseResult;

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Current Annual Costs</h2>
        <p className="text-3xl font-bold text-slate-900">
          ${(totalFuelCost || 0).toLocaleString()}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">Potential Savings</h2>
        <p className="text-2xl font-bold text-slate-900">
          ${(estimatedSavings || 0).toLocaleString()}
        </p>
        <p className="text-sm">Annual savings</p>
        <p className="text-sm">{((estimatedSavings / totalFuelCost) * 100).toFixed(1)}% reduction in fuel costs</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">Environmental Impact</h2>
        <p className="text-2xl font-bold text-slate-900">
          {Math.round(co2Reduction || 0).toLocaleString()} MT
        </p>
        <p className="text-sm">Annual CO₂ emissions reduction</p>
      </div>
    </div>
  );
}