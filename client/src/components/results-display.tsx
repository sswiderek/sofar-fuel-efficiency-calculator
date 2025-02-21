import { DollarSign, Leaf, Settings } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"; // Assumed import path
import { CalculationResult } from "@/lib/types";

interface ResultsDisplayProps {
  scenario: CalculationResult;
}

export function ResultsDisplay({ scenario }: ResultsDisplayProps) {
  const carsEquivalent = Math.round(scenario.data.co2Reduction / 4.6);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Current Annual Costs</h2>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <span>ⓘ</span> {/* Added a simple trigger */}
              </TooltipTrigger>
              <TooltipContent>
                <p>Based on your fleet size, voyage details, and current fuel prices</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="mt-2 text-3xl font-bold">{formatCurrency(scenario.data.totalFuelCost)}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card/50 p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-orange-700">
              <Settings className="h-3.5 w-3.5" />
              <h3 className="text-sm font-medium">Optimized Cost</h3>
            </div>
            <p className="text-xl font-semibold text-orange-900">
              {formatCurrency(scenario.data.optimizedCost)}
            </p>
            <p className="text-sm text-orange-600">
              {scenario.data.savingsPercentage}% reduction in fuel costs
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-orange-700">
              <DollarSign className="h-3.5 w-3.5" />
              <h3 className="text-sm font-medium">Estimated Savings</h3>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <span>ⓘ</span> {/* Added a simple trigger */}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Annual fuel cost savings based on your fleet's optimization potential</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xl font-semibold text-orange-900">
              {formatCurrency(scenario.data.savings)}/year
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card/50 p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-green-700">
            <Leaf className="h-3.5 w-3.5" />
            <h3 className="text-sm font-medium">CO₂ Reduction</h3>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <span>ⓘ</span> {/* Added a simple trigger */}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Estimated annual reduction in CO₂ emissions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xl font-semibold text-green-900">
            {formatNumber(scenario.data.co2Reduction)} MT
          </p>
          <p className="text-sm text-green-600">
            ≈ {formatNumber(carsEquivalent)} cars off the road
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <span>ⓘ</span> {/* Added a simple trigger */}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Equivalent to removing this many passenger vehicles from the road for one year</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
        </div>
      </div>
    </div>
  );
}