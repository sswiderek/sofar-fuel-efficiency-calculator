import { Card } from "@/components/ui/card";
import { CalculationResult } from "@shared/schema";
import { DollarSign, Info, LeafIcon, InfoIcon, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ResultsDisplayProps {
  results: CalculationResult[] | null;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results || results.length === 0) return null;

  const result = results[0];
  const annualSavings = result.estimatedSavings;
  const co2Reduction = result.co2Reduction;
  const carsOffRoad = co2Reduction / 4.6;

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Analysis Results</h2>
      <div className="grid gap-5">
        <Card className="bg-gradient-to-br from-[#175D8D] to-[#0D4A75] p-7 shadow-xl border-0">
          <div className="flex items-center gap-2.5 text-white/95">
            <DollarSign className="h-5 w-5" strokeWidth={2} />
            <span className="text-base font-semibold tracking-wide">Annual Savings</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 cursor-help opacity-80 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-[250px] space-y-2">
                  <p className="text-sm leading-snug text-white">
                    These savings are calculated based on your fleet's fuel consumption and current VLSFO prices, incorporating Wayfinder's proven optimization algorithms.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-5">
            <div className="flex flex-col gap-1.5">
              <div className="text-4xl font-bold tracking-tight text-white">
                ${result.estimatedSavings.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-white/80">
                Projected Cost Reduction
              </div>
              <div className="text-sm leading-relaxed text-white/85 mt-4 font-medium">
                Based on your fleet's annual fuel consumption of {result.totalFuelConsumption.toLocaleString()} MT, 
                you could achieve significant savings with Wayfinder's proven optimization technology.
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="rounded-full p-1 bg-slate-100">
              <Info className="h-4 w-4" />
            </div>
            <span className="text-base font-medium">Cost Breakdown</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 cursor-help opacity-80 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-[250px] space-y-2">
                  <p className="text-sm leading-snug">
                    The cost breakdown shows your current annual fuel costs based on consumption and VLSFO price, compared to projected costs with Wayfinder's optimization. The difference represents your potential savings.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-4">
            <div>
              <div className="text-sm text-slate-600">Current Annual Fuel Cost:</div>
              <div className="text-2xl font-bold tracking-tight">${result.totalFuelCost.toLocaleString()}</div>
              <div className="space-y-1">
                <div className="text-[0.7rem] text-slate-500">
                  VLSFO price: ${(result.fuelPrice || 0).toLocaleString()}/MT × {(result.totalFuelConsumption || 0).toLocaleString()} MT annual consumption
                </div>
                <div className="text-[0.7rem] bg-slate-50 p-2 rounded">
                  <div className="font-medium mb-2">Fleet Breakdown:</div>
                  <div className="text-slate-600 mb-2">
                    <div className="flex justify-between">
                      <span>Fuel Price:</span>
                      <span>${results?.[0]?.fuelPrice?.toLocaleString()}/MT</span>
                    </div>
                  </div>
                  {Array.isArray(results?.[0]?.vessels) && results[0].vessels.map((vessel, index) => (
                    <div key={index} className="mb-3 last:mb-0 pb-2 border-b border-slate-200 last:border-0">
                      <div className="font-medium text-slate-700">
                        {vessel.count} × {vessel.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </div>
                      <div className="text-slate-600 pl-3 space-y-0.5">
                        <div className="flex justify-between">
                          <span>Daily Consumption:</span>
                          <span>{vessel.fuelConsumption} MT/day</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Days at Sea:</span>
                          <span>{vessel.seaDaysPerYear} days/year</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Annual Consumption:</span>
                          <span>{(vessel.fuelConsumption * vessel.seaDaysPerYear * vessel.count).toLocaleString()} MT</span>
                        </div>
                      </div>
                      <div className="text-slate-600 pl-3 space-y-0.5 mt-1">
                        <div className="flex justify-between">
                          <span>Daily Consumption:</span>
                          <span>{vessel.fuelConsumption.toLocaleString()} MT/day</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Days at Sea:</span>
                          <span>{vessel.seaDaysPerYear} days/year</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Annual Consumption:</span>
                          <span>{(vessel.fuelConsumption * vessel.seaDaysPerYear * vessel.count).toLocaleString()} MT</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <div className="flex justify-between font-medium">
                      <span>Total Annual Consumption:</span>
                      <span>{results?.[0]?.totalAnnualConsumption?.toLocaleString()} MT</span>
                    </div>
                    <div className="flex justify-between font-medium mt-1">
                      <span>Total Annual Fuel Cost:</span>
                      <span>${results?.[0]?.totalFuelCost?.toLocaleString()}</span>
                    </div>
                  </div">
                    <div className="flex justify-between font-medium">
                      <span>Total Annual Consumption:</span>
                      <span>{result.totalFuelConsumption.toLocaleString()} MT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[1px] bg-slate-200 my-3" />
            <div>
              <div className="text-sm text-slate-600">Cost with Wayfinder:</div>
              <div className="text-2xl font-bold tracking-tight text-emerald-600">${(result.totalFuelCost - annualSavings).toLocaleString()}</div>
              <div className="text-[0.7rem] text-slate-500">
                Optimized routing and operations could reduce your annual fuel spend by ${annualSavings.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 shadow-xl border-0">
          <div className="flex items-center gap-2 text-white/95">
            <LeafIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Environmental Impact</span>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 cursor-help opacity-80 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-[250px] space-y-2">
                  <p className="text-sm leading-snug">
                    CO₂ reduction is calculated using the standard maritime emission factor of 3.15 MT of CO₂ per MT of fuel burned. The reduction in fuel consumption leads directly to reduced emissions.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{Math.round(co2Reduction).toLocaleString()} MT</div>
            <div className="text-white/90 font-medium text-sm">Annual CO₂ Reduction</div>
            <p className="text-[0.7rem] text-white/80 mt-2 leading-relaxed">
              Reducing fuel by {(result.totalFuelConsumption * 0.05).toFixed(0)} MT annually prevents {Math.round(co2Reduction).toLocaleString()} MT of CO₂ emissions, equivalent to {Math.round(carsOffRoad).toLocaleString()} cars off the road yearly.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}