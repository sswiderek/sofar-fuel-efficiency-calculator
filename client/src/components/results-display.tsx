
import { WavesIcon, Fuel as FuelIcon, DollarSign as DollarSignIcon, LeafIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { CalculationResult } from "@shared/schema";

interface ResultsDisplayProps {
  results: (CalculationResult & { label: string })[];
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const mainResult = results[1]; // Average savings scenario

  return (
    <div className="space-y-8">
      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-white/20" />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sky-100 rounded-xl">
                  <DollarSignIcon className="h-5 w-5 text-sky-700" />
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger className="text-sm font-medium text-slate-900">
                      Current Annual Fuel Cost
                    </TooltipTrigger>
                    <TooltipContent>
                      Your current annual fuel spending
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {formatCurrency(mainResult.totalFuelCost)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-white/20" />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 rounded-xl">
                  <DollarSignIcon className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger className="text-sm font-medium text-slate-900">
                      Potential Annual Savings
                    </TooltipTrigger>
                    <TooltipContent>
                      Estimated savings using Wayfinder route optimization
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">
                    {formatCurrency(mainResult.estimatedSavings)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supporting metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-white/20" />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <FuelIcon className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger className="text-sm font-medium text-slate-900">
                      Annual Fuel Consumption
                    </TooltipTrigger>
                    <TooltipContent>
                      Total annual fuel consumption in metric tons
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {formatNumber(mainResult.totalFuelConsumption)} MT
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-white/20" />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 rounded-xl">
                  <LeafIcon className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger className="text-sm font-medium text-slate-900">
                      CO₂ Reduction
                    </TooltipTrigger>
                    <TooltipContent>
                      Estimated annual CO₂ emissions reduction
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {formatNumber(mainResult.totalFuelConsumption * 3.15)} MT
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenarios comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((result, i) => (
          <Card key={i} className="bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-slate-900 mb-2">{result.label}</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Annual Savings</p>
                <p className="text-lg font-bold text-emerald-600">
                  {formatCurrency(result.estimatedSavings)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
