
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
  const baseResult = results?.[0] || {};
  const {
    totalFuelCost = 0,
    estimatedSavings = 0,
    fuelCostWithWayfinder = 0,
    co2Reduction = 0,
    totalFuelConsumption = 0
  } = baseResult;

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-slate-600">Current Annual Costs</h2>
          <SmartTooltip content="Your current annual fuel costs based on provided consumption" />
        </div>
        <p className="text-4xl font-bold text-slate-900">
          ${totalFuelCost.toLocaleString()}
        </p>
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 flex-1 p-4 bg-blue-600 rounded-lg text-white">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <h3 className="text-sm font-medium">Estimated Savings</h3>
            <SmartTooltip content="Projected annual fuel cost savings" />
          </div>
          <p className="text-2xl font-bold">${estimatedSavings.toLocaleString()}</p>
          <p className="text-sm opacity-90">Annual savings</p>
        </div>

        <div className="space-y-2 flex-1 p-4 bg-emerald-600 rounded-lg text-white">
          <div className="flex items-center gap-2">
            <LeafIcon className="h-4 w-4" />
            <h3 className="text-sm font-medium">CO₂ Reduction</h3>
            <SmartTooltip content="Annual reduction in carbon dioxide emissions" />
          </div>
          <p className="text-2xl font-bold">{Math.round(co2Reduction).toLocaleString()} MT</p>
          <p className="text-sm opacity-90">Annual emissions saved</p>
        </div>
      </div>
    </div>
  );
}
