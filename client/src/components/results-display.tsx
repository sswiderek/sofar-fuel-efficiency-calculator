import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DollarSign, Leaf as LeafIcon } from "lucide-react";
import { SmartTooltip } from "./smart-tooltip";
import { TooltipContent } from "./ui/tooltip";
import type { CalculationResult } from "@shared/schema";

interface ResultsDisplayProps {
  results: CalculationResult;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const {
    totalFuelCost,
    scenarios,
    co2Reduction,
    carsOffRoad,
  } = results;

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Current Annual Costs</h2>
        <p className="text-3xl font-bold text-slate-900">
          ${totalFuelCost.toLocaleString()}
        </p>
      </div>

      <div className="grid gap-4">
        <Card className="border shadow-sm bg-orange-700 text-white">
          <CardContent className="p-2.5">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                <h3 className="text-sm font-medium">Estimated Savings</h3>
                <SmartTooltip content={
                  <TooltipContent className="w-64 text-xs">
                    <div className="space-y-3 py-1">
                      <p className="font-medium">Here's how we calculate your savings:</p>
                      <ol className="space-y-2 pl-5 list-decimal">
                        <li>We first calculate how many days your ships spend at sea annually, accounting for port time</li>
                        <li>Then multiply by your fleet size, daily fuel usage, and current fuel prices</li>
                        <li>Finally, we apply the estimated savings percentage based on typical results from route optimization</li>
                      </ol>
                    </div>
                  </TooltipContent>
                } />
              </div>
              <p className="text-2xl font-bold">${average.savings.toLocaleString()}</p>
              <p className="text-sm">Annual savings</p>
              <p className="text-sm">{average.percentage}% reduction in fuel costs</p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <LeafIcon className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-slate-900">CO₂ Reduction</p>
                <SmartTooltip content={
                  <TooltipContent className="w-64 text-xs">
                    Each metric ton of fuel burned produces 3.15 metric tons of CO₂ based on standard shipping benchmarks.
                  </TooltipContent>
                } />
              </div>
              <p className="text-lg font-semibold text-slate-900 mt-1">{co2Reduction.toLocaleString()} MT</p>
              <p className="text-sm text-slate-600">Annual emissions saved</p>
              <p className="text-sm text-slate-600 mt-1">≈ {carsOffRoad.toLocaleString()} cars off the road</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}