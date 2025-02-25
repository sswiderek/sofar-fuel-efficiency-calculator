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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 to-white/40" />
          <CardContent className="pt-8 pb-6 px-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-sky-100 rounded-xl shadow-sm">
                  <DollarSignIcon className="h-6 w-6 text-sky-700" />
                </div>
                <Tooltip>
                  <TooltipTrigger className="text-sm font-medium text-slate-600 hover:text-slate-900">
                    Current Annual Fuel Cost
                  </TooltipTrigger>
                  <TooltipContent>
                    Your current annual fuel spending
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-4xl font-bold text-slate-900 tracking-tight">
                {formatCurrency(mainResult.totalFuelCost)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 to-white/40" />
          <CardContent className="pt-8 pb-6 px-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-emerald-100 rounded-xl shadow-sm animate-pulse">
                  <DollarSignIcon className="h-6 w-6 text-emerald-700" />
                </div>
                <Tooltip>
                  <TooltipTrigger className="text-sm font-medium text-emerald-600 hover:text-emerald-900">
                    Potential Annual Savings
                  </TooltipTrigger>
                  <TooltipContent>
                    Estimated savings using Wayfinder route optimization
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-4xl font-bold text-emerald-600 tracking-tight">
                {formatCurrency(mainResult.estimatedSavings)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supporting metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card className="relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 to-white/40" />
          <CardContent className="pt-8 pb-6 px-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                  <FuelIcon className="h-6 w-6 text-blue-700" />
                </div>
                <Tooltip>
                  <TooltipTrigger className="text-sm font-medium text-blue-600 hover:text-blue-900">
                    Annual Fuel Consumption
                  </TooltipTrigger>
                  <TooltipContent>
                    Total annual fuel consumption in metric tons
                  </TooltipContent>
                </Tooltip>
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900 tracking-tight">
                  {formatNumber(mainResult.totalFuelConsumption)}
                </p>
                <p className="text-sm font-medium text-slate-500 mt-1">Metric Tons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 to-white/40" />
          <CardContent className="pt-8 pb-6 px-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-green-100 rounded-xl shadow-sm">
                  <LeafIcon className="h-6 w-6 text-green-700" />
                </div>
                <Tooltip>
                  <TooltipTrigger className="text-sm font-medium text-green-600 hover:text-green-900">
                    CO₂ Reduction
                  </TooltipTrigger>
                  <TooltipContent>
                    Estimated annual CO₂ emissions reduction
                  </TooltipContent>
                </Tooltip>
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900 tracking-tight">
                  {formatNumber(mainResult.totalFuelConsumption * 3.15)}
                </p>
                <p className="text-sm font-medium text-slate-500 mt-1">Metric Tons</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}