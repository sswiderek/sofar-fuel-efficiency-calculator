import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";
import type { CalculationResult } from "@shared/schema";
import { TrendingDown, DollarSign, Leaf, Settings } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";

const useTouchDevice = () => {
  return (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
};

// Assume SmartTooltip is defined elsewhere and handles touch events appropriately
import React from 'react';

const SmartTooltip = ({ content, children }) => {
  const isTouch = useTouchDevice();
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef(null);

  React.useEffect(() => {
    console.log('SmartTooltip mounted with touch:', isTouch);
  }, [isTouch]);

  const handleInteraction = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  return isTouch ? (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          type="button"
          className="inline-block touch-target"
          ref={triggerRef}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleInteraction(e);
          }}
          style={{ touchAction: 'none' }}
        >
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="z-[100] w-60 text-xs p-2 rounded-md border bg-white shadow-md"
        onOpenAutoFocus={(e) => {
          console.log('Popover opening');
          e.preventDefault();
        }}
      >
        {content}
      </PopoverContent>
    </Popover>
  ) : (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen} delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="inline-block">{children}</div>
        </TooltipTrigger>
        {content}
      </Tooltip>
    </TooltipProvider>
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

  const scenarios = {
    conservative: {
      title: "Conservative",
      data: getScenarioData(0),
    },
    average: {
      title: "Average",
      data: getScenarioData(1),
    },
    optimal: {
      title: "Optimal",
      data: getScenarioData(2),
    },
  };

  function getScenarioData(scenarioIndex: number) {
    const savings = results[scenarioIndex].estimatedSavings;
    const totalCost = results[scenarioIndex].totalFuelCost;
    const optimizedCost = results[scenarioIndex].fuelCostWithWayfinder;
    const savingsPercent = (savings / totalCost) * 100;

    return {
      currentCost: totalCost,
      optimizedCost: optimizedCost,
      savings: savings,
      co2Reduction: results[scenarioIndex].co2Reduction,
      improvement: savingsPercent.toFixed(0),
    };
  }

  return (
    <TooltipProvider delayDuration={0} disableHoverableContent skipDelayDuration={0}>
      <div className="space-y-4 pt-6">
        <Card className="border bg-white shadow-sm">
          <CardContent className="p-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-slate-600">
                  Current Annual Costs
                </h3>
                {useTouchDevice() ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="p-2 -m-1 border-0 bg-transparent cursor-pointer touch-target"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 text-xs">
                      Based on{" "}
                      <span className="font-bold">
                        {formatNumber(results[0].totalFuelConsumption)}
                      </span>{" "}
                      MT of fuel consumed annually by your fleet (including both sea and port consumption)
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Tooltip delayDuration={400}>
                    <TooltipTrigger asChild>
                      {/* Removed onTouchStart */}
                      <button
                        type="button"
                        className="p-2 -m-1 border-0 bg-transparent cursor-pointer touch-target"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={5} className="w-60">
                      Based on annual consumption:
                      <div className="mt-2 text-slate-600">
                        <p className="font-medium mb-1">Sea Operations:</p>
                        <p className="text-sm">
                          {formatNumber(results[0].fleetSize)} ships ×
                          {formatNumber(results[0].daysAtSea)} days at sea ×
                          {formatNumber(results[0].fuelConsumption)} MT/day
                        </p>
                        <p className="font-medium mt-2 mb-1">Port Operations:</p>
                        <p className="text-sm">
                          {formatNumber(results[0].fleetSize)} ships ×
                          {formatNumber(results[0].portTimePerVoyage)} days in port ×
                          {formatNumber(results[0].portFuelConsumption)} MT/day
                        </p>
                        <p className="font-medium mt-2">
                          Fuel Cost: ${formatNumber(results[0].fuelPrice)}/MT
                        </p>
                        <p className="text-xs mt-1 text-slate-500">Note: Wayfinder optimization applies to sea operations only</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {formatCurrency(results[0].totalFuelCost)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="average" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1">
            {Object.entries(scenarios).map(([key, scenario]) => (
              <TabsTrigger
                value={key}
                key={key}
                className={cn(
                  "text-sm font-medium",
                  key === "conservative" &&
                    "data-[state=active]:bg-sky-100 data-[state=active]:text-sky-900",
                  key === "average" &&
                    "data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900",
                  key === "optimal" &&
                    "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
                )}
              >
                {scenario.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(scenarios).map(([key, scenario]) => (
            <TabsContent key={key} value={key} className="mt-3">
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={cn(
                    "border shadow-sm",
                    key === "conservative" && "bg-sky-50",
                    key === "average" && "bg-orange-50",
                    key === "optimal" && "bg-emerald-50"
                  )}
                >
                  <CardContent className="p-2.5">
                    <div className="space-y-1">
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          key === "conservative" && "text-sky-700",
                          key === "average" && "text-amber-700",
                          key === "optimal" && "text-emerald-700"
                        )}
                      >
                        <Settings className="h-3.5 w-3.5" />
                        <h3 className="text-sm font-medium">Optimized Cost</h3>
                      </div>
                      <p className="text-lg font-bold text-slate-900">
                        {formatCurrency(scenario.data.optimizedCost)}
                      </p>
                      <p
                        className={cn(
                          "text-[11px] font-medium",
                          key === "conservative" && "text-sky-700",
                          key === "average" && "text-amber-700",
                          key === "optimal" && "text-emerald-700"
                        )}
                      >
                        <TrendingDown className="h-2.5 w-2.5 inline mr-1" />
                        {scenario.data.improvement}% reduction in fuel costs
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "border shadow-sm text-white",
                    key === "conservative" && "bg-sky-700",
                    key === "average" && "bg-orange-700",
                    key === "optimal" && "bg-emerald-700"
                  )}
                >
                  <CardContent className="p-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        <h3 className="text-sm font-medium">
                          Estimated Savings
                        </h3>
                        <SmartTooltip content={
                          <TooltipContent className="w-64 text-xs">
                            <div className="space-y-2 py-1">
                              <p className="font-medium">Annual Consumption:</p>
                              <div className="space-y-1.5">
                                <p>• Sea: Fleet × Days at Sea × MT/Day</p>
                                <p>• Port: Fleet × Port Days × MT/Day</p>
                                <p className="mt-2">Optimization ({key === "conservative" ? "3%" : key === "average" ? "5%" : "7%"}) applies to sea operations only</p>
                              </div>
                            </div>
                          </TooltipContent>
                        }>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="p-1 -m-1 border-0 bg-transparent"
                            >
                              <InfoCircledIcon className="h-3.5 w-3.5 opacity-70" />
                            </button>
                          </TooltipTrigger>
                        </SmartTooltip>
                      </div>
                      <p className="text-lg font-bold">
                        {formatCurrency(scenario.data.savings)}
                      </p>
                      <p className="text-[11px]">Annual savings</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card
                className={cn(
                  "mt-3 md:mt-4 border shadow-sm",
                  key === "conservative" && "bg-sky-50/50",
                  key === "average" && "bg-orange-50/50",
                  key === "optimal" && "bg-emerald-50/50"
                )}
              >
                <CardContent className="p-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-emerald-700">
                      <Leaf className="h-3.5 w-3.5" />
                      <h3 className="text-sm font-medium">CO₂ Reduction</h3>
                    </div>
                    <p className="text-lg font-bold text-emerald-800">
                      {formatNumber(scenario.data.co2Reduction)} MT
                    </p>
                    <p className="text-[11px] text-emerald-600">
                      Annual emissions saved
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-[11px] text-emerald-600">
                        ≈ {formatNumber(scenario.data.co2Reduction * 0.217)} cars
                        off the road
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
                            {/* Removed onTouchStart */}
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </TooltipProvider>
  );
}