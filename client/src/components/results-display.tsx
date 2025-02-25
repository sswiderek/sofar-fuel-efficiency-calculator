import React from "react";
import { Settings, TrendingDown } from "lucide-react";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTouchDevice } from "@/lib/hooks/useTouchDevice"; //Corrected import path


interface Props {
  result: CalculationResult;
}

export default function ResultsDisplay({ result }: Props) {
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

  const savings = result.estimatedSavings;
  const totalCost = result.totalFuelCost;
  const optimizedCost = result.fuelCostWithWayfinder;
  const savingsPercent = (savings / totalCost) * 100;
  const data = {
    currentCost: totalCost,
    optimizedCost: optimizedCost,
    savings: savings,
    co2Reduction: result.co2Reduction,
    improvement: savingsPercent.toFixed(0),
  };

  return (
    <div className="mt-3">
      <div className="grid grid-cols-2 gap-3">
        <Card className="border shadow-sm bg-orange-50">
          <CardContent className="p-2.5">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-amber-700">
                <Settings className="h-3.5 w-3.5" />
                <h3 className="text-sm font-medium">Optimized Cost</h3>
              </div>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(data.optimizedCost)}
              </p>
              <p className="text-[11px] font-medium text-amber-700">
                <TrendingDown className="h-2.5 w-2.5 inline mr-1" />
                {data.improvement}% reduction in fuel costs
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-emerald-50">
          <CardContent className="p-2.5">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-emerald-700">
                <Settings className="h-3.5 w-3.5" />
                <h3 className="text-sm font-medium">CO₂ Reduction</h3>
              </div>
              <p className="text-lg font-bold text-emerald-800">
                {formatNumber(data.co2Reduction)} MT
              </p>
              <p className="text-[11px] text-emerald-600">
                Annual emissions saved
              </p>
              <div className="flex items-center gap-1">
                <p className="text-[11px] text-emerald-600">
                  ≈ {formatNumber(data.co2Reduction * 0.217)} cars off the road
                </p>
                {useTouchDevice() ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="p-1 -m-1 border-0 bg-transparent touch-manipulation"
                        onTouchStart={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <InfoCircledIcon className="h-3 w-3 text-emerald-600" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 text-xs">
                      Equivalent to removing this many passenger vehicles
                      from the road for one year, based on average annual
                      vehicle emissions of 4.6 metric tons of CO₂ (EPA,
                      2023)
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="p-1 -m-1 border-0 bg-transparent"
                      >
                        <InfoCircledIcon className="h-3 w-3 text-emerald-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={16} className="w-60">
                      Equivalent to removing this many passenger vehicles
                      from the road for one year, based on average annual
                      vehicle emissions of 4.6 metric tons of CO₂ (EPA,
                      2023)
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}