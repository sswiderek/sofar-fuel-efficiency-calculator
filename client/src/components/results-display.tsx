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
      title: "3% Savings",
      data: getScenarioData(0),
    },
    average: {
      title: "5% Savings",
      data: getScenarioData(1),
    },
    optimal: {
      title: "7% Savings",
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
        <Card className="border bg-white/40 mb-8">
          <CardContent className="p-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-medium text-slate-400/80">
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
                      Total yearly fuel usage: {formatNumber(results[0].totalFuelConsumption)} MT
                      <div className="mt-2">
                        <p className="mb-1">• At sea: {formatNumber(results[0].fleetSize)} ships × {formatNumber(results[0].daysAtSea)} days × {formatNumber(results[0].fuelConsumption)} MT/day</p>
                        <p>• In port: {formatNumber(results[0].fleetSize)} ships × {formatNumber(results[0].portTimePerVoyage)} days × {formatNumber(results[0].portFuelConsumption)} MT/day</p>
                      </div>
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
                    <TooltipContent side="top" sideOffset={5} className="w-72">
                      How we calculate annual fuel costs:
                      <div className="space-y-2 py-1">
                              <p className="font-medium">How we calculate annual fuel costs:</p>
                              <ol className="space-y-2 pl-4 list-decimal">
                                <li>
                                  <p className="font-medium">Calculate annual sea days:</p>
                                  <ul className="mt-1 space-y-1 text-slate-600">
                                    <li>Days per voyage = {formatNumber(results[0].voyageLength)} sea days + {formatNumber(results[0].portTimePerVoyage)} port days</li>
                                    <li>Voyages per year = 365 ÷ {formatNumber(results[0].voyageLength + results[0].portTimePerVoyage)} total days</li>
                                    <li>Annual sea days = Voyages × {formatNumber(results[0].voyageLength)} sea days</li>
                                  </ul>
                                </li>
                                <li>
                                  <p className="font-medium">Calculate total fuel consumption:</p>
                                  <ul className="mt-1 space-y-1 text-slate-600">
                                    <li>Daily fleet consumption = {formatNumber(results[0].fleetSize)} ships × {formatNumber(results[0].fuelConsumption)} MT/day</li>
                                    <li>Annual consumption = {formatNumber(results[0].totalFuelConsumption)} MT</li>
                                  </ul>
                                </li>
                                <li>
                                  <p className="font-medium">Calculate total cost:</p>
                                  <ul className="mt-1 space-y-1 text-slate-600">
                                    <li>{formatNumber(results[0].totalFuelConsumption)} MT × ${formatNumber(results[0].fuelPrice)}/MT = ${formatNumber(results[0].totalFuelCost)}</li>
                                  </ul>
                                </li>
                              </ol>
                              <p className="text-xs text-slate-500">Note: These calculations only include fuel consumption at sea, not in port</p>
                            </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p className="text-2xl font-medium tracking-tight text-slate-500">
                {formatCurrency(results[0].totalFuelCost)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 mb-6">
          <div className="bg-slate-100 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-slate-700">Savings Scenarios</h2>
                <p className="text-slate-500 text-sm mt-1">Based on historical platform data</p>
              </div>
              <div className="text-sm font-medium text-slate-600 bg-white/80 px-4 py-2 rounded-full border border-slate-200">
                3-7% typical range
              </div>
            </div>
          </div>
        </div>
        
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
                            <div className="space-y-3 py-1">
                              <p className="font-medium">
                                Here's how we calculate your savings:
                              </p>
                              <ol className="space-y-2 pl-5 list-decimal">
                                <li>
                                  We first calculate how many days your ships
                                  spend at sea annually, accounting for port time
                                </li>
                                <li>
                                  Then multiply by your fleet size, daily fuel
                                  usage, and fuel price
                                </li>
                                <li>
                                  Finally, apply the optimization level (
                                  {key === "conservative"
                                    ? "3%"
                                    : key === "average"
                                    ? "5%"
                                    : "7%"}
                                  ) to find potential savings
                                </li>
                              </ol>
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
                      <SmartTooltip content={
                        <TooltipContent className="w-64 text-xs">
                          <div className="space-y-2 py-1">
                            <p className="font-medium">How we calculate CO₂ reduction:</p>
                            <ol className="space-y-1 pl-4 list-decimal">
                              <li>Calculate fuel saved = Annual fuel consumption × Optimization savings %</li>
                              <li>CO₂ reduction = Fuel saved × 3.15 (MT of CO₂ per MT of fuel)</li>
                            </ol>
                          </div>
                        </TooltipContent>
                      }>
                        <button type="button" className="p-1 -m-1 border-0 bg-transparent">
                          <InfoCircledIcon className="h-3.5 w-3.5 text-emerald-700 opacity-70" />
                        </button>
                      </SmartTooltip>
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