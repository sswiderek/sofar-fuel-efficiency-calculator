import { Card } from "@/components/ui/card";
import { CalculationResult } from "@shared/schema";
import { DollarSign, Info, LeafIcon, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ResultsDisplayProps {
  results: CalculationResult[] | null;
}

const formatNumber = (num: number): string => {
  return num.toLocaleString(); //Simple implementation, replace with your actual formatting logic if needed.
}


export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results || results.length === 0) return null;

  const result = results[0];

  return (
    <div className="max-w-4xl space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Analysis Results</h2>
      <div className="grid gap-4">
        <Card className="bg-gradient-to-br from-[#0E6396] to-[#0A4F78] text-white p-6">
          <div className="flex items-center gap-2.5 text-white/90">
            <DollarSign className="h-5 w-5" />
            <span className="text-base font-medium">Annual Savings</span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="text-4xl font-bold mt-3 tracking-tight">${formatNumber(result.totalFuelCost * 0.05)}</div>
              <div className="text-sm text-white/90 mt-1">Projected cost reduction</div>
            </div>
            <div className="text-white/80 text-sm max-w-[240px] flex items-center h-full leading-snug">
              Based on your fleet's annual fuel consumption of {formatNumber(result.totalFuelConsumption)} MT, we project significant savings using Wayfinder's proven optimization technology. This conservative 5% estimate falls within our documented 4-10% efficiency improvements.
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6">
          <div className="flex items-center gap-2.5 text-slate-600">
            <Info className="h-5 w-5" />
            <span className="text-base font-medium">Cost Breakdown</span>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-600">Current Annual Fuel Cost:</span>
                <span className="text-xl font-semibold">${formatNumber(result.totalFuelCost)}</span>
              </div>
              <p className="text-sm text-slate-500">
                Calculated using current VLSFO price of ${result.fuelPrice}/MT × {formatNumber(result.totalFuelConsumption)} MT annual consumption
              </p>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-600">Cost with Wayfinder:</span>
                <span className="text-xl font-semibold text-emerald-600">${formatNumber(result.totalFuelCost * 0.95)}</span>
              </div>
              <p className="text-sm text-slate-500">
                Optimized routing and operations could reduce your annual fuel spend by ${formatNumber(result.totalFuelCost * 0.05)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2">
            <LeafIcon className="h-5 w-5 text-emerald-600" />
            <span className="text-lg font-medium text-emerald-700">CO₂ Reduction</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-emerald-400" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-[250px] space-y-2">
                  <h4 className="font-medium">How We Calculate CO₂ Reduction</h4>
                  <div className="text-sm text-slate-600">
                    <p>We calculate your annual CO₂ reduction by multiplying your fuel savings by 3.15 (the CO₂ emission factor), giving you the metric tons of CO₂ avoided per year.</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-emerald-700">{Math.round(result.co2Reduction).toLocaleString()} MT</div>
            <div className="text-base text-emerald-600 mt-1">Annual emissions saved</div>
            <div className="flex items-center gap-1.5 mt-3 text-emerald-600">
              <span>≈ {Math.round((result.totalFuelConsumption * 0.05 * 3.15) / 4.6).toLocaleString()} cars off the road</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-emerald-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Based on average annual emissions of 4.6 metric tons CO₂ per passenger vehicle</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}