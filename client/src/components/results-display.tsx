import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";
import type { CalculationResult } from "@shared/schema";
import { TrendingDown, DollarSign, Leaf, Settings } from "lucide-react";

const useTouchDevice = () => {
  return (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
};

interface Props {
  results: CalculationResult[];
}

export default function ResultsDisplay({ results }: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(Math.round(value));

  // Using the average scenario (index 1)
  const data = {
    currentCost: results[1].totalFuelCost,
    optimizedCost: results[1].fuelCostWithWayfinder,
    savings: results[1].estimatedSavings,
    co2Reduction: results[1].co2Reduction,
    improvement: ((results[1].estimatedSavings / results[1].totalFuelCost) * 100).toFixed(0)
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <DollarSign className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Current Annual Cost</h3>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent className="w-64">
                      <p className="text-xs">Based on your current fuel consumption and days at sea</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(data.currentCost)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-emerald-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Settings className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Optimized Cost</h3>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-emerald-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-64">
                      <p className="text-xs">Projected annual costs with Wayfinder optimization</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(data.optimizedCost)}
                </p>
                <p className="text-sm font-medium text-emerald-700">
                  {data.improvement}% reduction in fuel costs
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-orange-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-700">
                  <TrendingDown className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Estimated Savings</h3>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-orange-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-64">
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Here's how we calculate your savings:</p>
                        <ol className="text-xs space-y-1 list-decimal pl-4">
                          <li>Calculate annual days at sea</li>
                          <li>Factor in fleet size and daily fuel usage</li>
                          <li>Apply optimization algorithms based on historical data</li>
                        </ol>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(data.savings)}
                </p>
                <p className="text-sm text-orange-700">Annual savings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-sky-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sky-700">
                  <Leaf className="h-4 w-4" />
                  <h3 className="text-sm font-medium">CO₂ Reduction</h3>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-sky-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-64">
                      <p className="text-xs">Annual reduction in CO₂ emissions through optimized routing</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatNumber(data.co2Reduction)} MT
                </p>
                <p className="text-sm text-sky-700">
                  ≈ {formatNumber(data.co2Reduction * 0.217)} cars off the road
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}