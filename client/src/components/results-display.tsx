import { Card } from "@/components/ui/card";
import { CalculationResult } from "@shared/schema";
import { DollarSign, Info, LeafIcon, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ResultsDisplayProps {
  results: CalculationResult[] | null;
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
              <div className="text-4xl font-bold mt-3 tracking-tight">${(result.totalFuelCost * 0.05).toLocaleString()}</div>
              <div className="text-sm text-white/90 mt-1">Projected cost reduction</div>
            </div>
            <div className="text-white/80 text-sm max-w-[240px] flex items-center h-full leading-snug">
              Based on your fleet's annual fuel consumption of {result.totalFuelConsumption.toLocaleString()} MT, we project significant savings using Wayfinder's proven optimization technology. This conservative 5% estimate falls within our documented 4-10% efficiency improvements.
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
                <span className="text-xl font-semibold">${result.totalFuelCost.toLocaleString()}</span>
              </div>
              <p className="text-sm text-slate-500">
                Calculated using current VLSFO price of ${result.fuelPrice}/MT × {result.totalFuelConsumption.toLocaleString()} MT annual consumption
              </p>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-600">Cost with Wayfinder:</span>
                <span className="text-xl font-semibold text-emerald-600">${(result.totalFuelCost * 0.95).toLocaleString()}</span>
              </div>
              <p className="text-sm text-slate-500">
                Optimized routing and operations could reduce your annual fuel spend by ${(result.totalFuelCost * 0.05).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-emerald-50 p-6">
          <div className="flex items-center gap-2.5 text-emerald-700">
            <LeafIcon className="h-5 w-5" />
            <span className="text-base font-medium">Environmental Impact</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-emerald-700">{(result.totalFuelConsumption * 0.05 * 3.11438).toFixed(0)} MT</div>
            <div className="text-emerald-700 font-medium mt-1">Annual CO₂ Reduction</div>
            <p className="text-sm text-emerald-600/90 mt-3 leading-relaxed">
              By reducing fuel consumption by {(result.totalFuelConsumption * 0.05).toFixed(0)} MT annually, 
              your fleet could prevent {(result.totalFuelConsumption * 0.05 * 3.11438).toFixed(0)} metric tons of CO₂ emissions. 
              This is equivalent to taking {((result.totalFuelConsumption * 0.05 * 3.11438) / 4.6).toFixed(0)} cars off the road for a year.
            </p>
          </div>
        </Card>

        <Card className="bg-white p-3.5">
          <div className="flex items-center gap-2 text-slate-700">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">Costs Breakdown</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-[250px] space-y-2">
                  <h4 className="font-medium">Cost Calculation</h4>
                  <div className="text-sm text-slate-600">
                    <p>Based on:</p>
                    <p className="pl-2 text-xs">• Annual fuel usage</p>
                    <p className="pl-2 text-xs">• Current market prices</p>
                    <p className="pl-2 text-xs">• 5% optimization savings</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex gap-36">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-sm text-slate-600">Current:</div>
                  <div className="text-xl font-semibold">${result.totalFuelCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">With Wayfinder:</div>
                  <div className="text-xl font-semibold">${(result.totalFuelCost * 0.95).toLocaleString()}</div>
                </div>
              </div>
              <div className="text-slate-600 text-xs max-w-[240px] flex items-start -mt-8">
                <div>
                  Here's how we calculate your optimized costs:
                  <ul className="list-disc mt-1 ml-3 space-y-1">
                    <li>Start with your current annual fuel costs</li>
                    <li>Apply Wayfinder's proven 5% efficiency improvement</li>
                    <li>This reduction comes from optimized routing and operational improvements</li>
                  </ul>
                </div>
              </div>
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
                  <div className="max-w-[250px] space-y-2">
                    <h4 className="font-medium">What does this mean?</h4>
                    <div className="text-sm text-slate-600">
                      <p>A typical car produces 4.6 metric tons of CO₂ per year. This shows how many cars would equal your fleet's CO₂ savings.</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}