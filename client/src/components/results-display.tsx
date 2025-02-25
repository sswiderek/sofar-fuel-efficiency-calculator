import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";
import type { CalculationResult } from "@shared/schema";
import { TrendingDown, DollarSign, Leaf, Settings } from "lucide-react";

function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(Math.round(num));
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

interface ResultsDisplayProps {
  data: CalculationResult;
}

export default function ResultsDisplay({ data }: ResultsDisplayProps) {
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
                      <p className="text-xs">Total annual fuel costs based on your current consumption patterns and operational profile</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(data.currentCost)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <Settings className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Optimized Cost</h3>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent className="w-64">
                      <p className="text-xs">Projected annual fuel costs after implementing recommended optimizations</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(data.optimizedCost)}
                </p>
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingDown className="h-3 w-3" />
                  <span>{Math.round((data.currentCost - data.optimizedCost) / data.currentCost * 100)}% reduction in fuel costs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border shadow-sm bg-slate-50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-600">
                <Leaf className="h-4 w-4" />
                <h3 className="text-sm font-medium">CO₂ Reduction</h3>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent className="w-64">
                    <p className="text-xs">Estimated annual reduction in CO₂ emissions from implementing recommended optimizations</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(data.co2Reduction)} MT
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <span>≈ {formatNumber(data.carsEquivalent)} cars off the road annually</span>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircledIcon className="h-3 w-3 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent className="w-64">
                    <p className="text-xs">Equivalent to removing this many passenger vehicles from the road for one year</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}