
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <DollarSignIcon className="h-4 w-4 text-sky-700" />
                </div>
                <Tooltip>
                  <TooltipTrigger className="text-sm font-medium text-slate-900">
                    Current Annual Fuel Cost
                  </TooltipTrigger>
                  <TooltipContent>
                    Total annual fuel cost based on your fleet's consumption
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(mainResult.totalFuelCost)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSignIcon className="h-4 w-4 text-emerald-700" />
                </div>
                <Tooltip>
                  <TooltipTrigger className="text-sm font-medium text-slate-900">
                    Potential Annual Savings
                  </TooltipTrigger>
                  <TooltipContent>
                    Estimated savings using Wayfinder route optimization
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(mainResult.estimatedSavings)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FuelIcon className="h-4 w-4 text-blue-700" />
                </div>
                <Tooltip>
                  <TooltipTrigger className="text-sm font-medium text-slate-900">
                    Annual Fuel Consumption
                  </TooltipTrigger>
                  <TooltipContent>
                    Total annual fuel consumption in metric tons
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(mainResult.totalFuelConsumption)} MT
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <LeafIcon className="h-4 w-4 text-green-700" />
                </div>
                <Tooltip>
                  <TooltipTrigger className="text-sm font-medium text-slate-900">
                    CO₂ Reduction
                  </TooltipTrigger>
                  <TooltipContent>
                    Potential annual CO₂ emissions reduction
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(mainResult.co2Reduction)} MT
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((result, i) => (
          <Card key={i}>
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
