
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

export function ResultsDisplay({ data }: ResultsDisplayProps) {
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
                      <p className="text-xs">Projected annual fuel costs after implementing route optimization and operational improvements</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(data.optimizedCost)}
                </p>
                <div className="flex items-center gap-2 text-emerald-700 text-sm">
                  <TrendingDown className="h-4 w-4" />
                  <span>{data.savingsPercentage}% reduction in fuel costs</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-amber-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-700">
                  <DollarSign className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Estimated Savings</h3>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-64">
                      <p className="text-xs">Projected annual savings from implementing route optimization and operational improvements</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(data.estimatedSavings)}
                </p>
                <p className="text-sm text-amber-700">Annual savings</p>
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
                      <p className="text-xs">Annual reduction in CO₂ emissions through optimized routing and improved operational efficiency</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatNumber(data.co2Reduction)} MT
                </p>
                <div className="flex items-center gap-1 text-sky-700 text-sm">
                  <span>≈ {formatNumber(data.co2Reduction * 0.217)} cars off the road</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-sky-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-64">
                      <p className="text-xs">Based on average annual emissions of a passenger vehicle (4.6 metric tons CO₂)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
