import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
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

interface SmartTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const SmartTooltip: React.FC<SmartTooltipProps> = ({ content, children }) => {
  const isTouch = useTouchDevice();
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

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
          e.preventDefault();
        }}
      >
        {content}
      </PopoverContent>
    </Popover>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="inline-block bg-transparent border-0">
            {children}
          </button>
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

  // We'll use the first result (Average scenario) for display
  const result = results[0];
  const savings = result.estimatedSavings;
  const totalCost = result.totalFuelCost;
  const optimizedCost = result.fuelCostWithWayfinder;
  const savingsPercent = (savings / totalCost) * 100;
  const co2Reduction = result.co2Reduction;

  return (
    <TooltipProvider delayDuration={0} disableHoverableContent skipDelayDuration={0}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        <Card className="border bg-white shadow-sm">
          <CardContent className="p-3">
            <div className="space-y-1">
              <div className="metric-header">
                <FuelIcon className="metric-icon" />
                <h3>Annual Fuel Consumption</h3>
                <SmartTooltip content={
                  <TooltipContent side="top" sideOffset={5} className="w-72">
                    <div className="space-y-2 py-1">
                      <p className="font-medium">How we calculate annual fuel consumption:</p>
                      <ul className="mt-1 space-y-1 text-slate-600">
                        <li>Daily fuel consumption × Days at sea × Number of vessels</li>
                      </ul>
                    </div>
                  </TooltipContent>
                }>
                  <InfoCircledIcon className="h-3.5 w-3.5 text-slate-400" />
                </SmartTooltip>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(result.totalFuelConsumption)} MT
              </p>
              <p className="text-xs text-slate-500">Total fuel consumed per year</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-white shadow-sm">
          <CardContent className="p-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-slate-600">
                  Current Annual Costs
                </h3>
                <SmartTooltip content={
                  <TooltipContent side="top" sideOffset={5} className="w-72">
                    <div className="space-y-2 py-1">
                      <p className="font-medium">How we calculate annual fuel costs:</p>
                      <ol className="space-y-2 pl-4 list-decimal">
                        <li>
                          Calculate total fuel consumption based on:
                          <ul className="mt-1 space-y-1 text-slate-600">
                            <li>Days at sea per year</li>
                            <li>Daily fuel consumption</li>
                            <li>Number of vessels</li>
                          </ul>
                        </li>
                        <li>
                          Multiply by current fuel price:
                          <ul className="mt-1 space-y-1 text-slate-600">
                            <li>{formatNumber(result.totalFuelConsumption)} MT × ${formatNumber(result.fuelPrice)}/MT</li>
                          </ul>
                        </li>
                      </ol>
                    </div>
                  </TooltipContent>
                }>
                  <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                </SmartTooltip>
              </div>
              <p className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {formatCurrency(totalCost)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="border shadow-sm bg-sky-50"> {/* Light Blue/White Background */}
            <CardContent className="p-2.5">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sky-700">
                  <Settings className="h-3.5 w-3.5" />
                  <h3 className="text-sm font-medium">Optimized Cost</h3>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(optimizedCost)}
                </p>
                <p className="text-[11px] font-medium text-sky-700">
                  <TrendingDown className="h-2.5 w-2.5 inline mr-1" />
                  {savingsPercent.toFixed(0)}% reduction in fuel costs
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="savings-tile"> {/* Light Blue/White Background */}
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
                          <li>Calculate total annual fuel consumption based on fleet size and usage</li>
                          <li>Apply optimization percentage to find fuel savings</li>
                          <li>Multiply by current fuel price to calculate cost savings</li>
                        </ol>
                      </div>
                    </TooltipContent>
                  }>
                    <InfoCircledIcon className="h-3.5 w-3.5 opacity-70" />
                  </SmartTooltip>
                </div>
                <p className="text-lg font-bold">
                  {formatCurrency(savings)}
                </p>
                <p className="text-[11px]">Annual savings</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-3 md:mt-4 border shadow-sm bg-emerald-50"> {/* Light Green/White Background */}
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
                  <InfoCircledIcon className="h-3.5 w-3.5 text-emerald-700 opacity-70" />
                </SmartTooltip>
              </div>
              <p className="text-lg font-bold text-emerald-800">
                {formatNumber(co2Reduction)} MT
              </p>
              <p className="text-[11px] text-emerald-600">
                Annual emissions saved
              </p>
              <div className="flex items-center gap-1">
                <p className="text-[11px] text-emerald-600">
                  ≈ {formatNumber(co2Reduction * 0.217)} cars off the road
                </p>
                <SmartTooltip content={
                  <TooltipContent className="w-60 text-xs">
                    Equivalent to removing this many passenger vehicles from the road
                    for one year, based on average annual vehicle emissions of 4.6
                    metric tons of CO₂ (EPA, 2023)
                  </TooltipContent>
                }>
                  <InfoCircledIcon className="h-3 w-3 text-emerald-600" />
                </SmartTooltip>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}