import { Card } from "@/components/ui/card";
import { CalculationResult } from "@shared/schema";
import { DollarSign, Info, LeafIcon, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ResultsDisplayProps {
  results: CalculationResult[];
}

const formatNumber = (num: number) => {
  return num.toLocaleString(undefined, { maximumFractionDigits: 1 });
};

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results || results.length === 0) return null;

  const result = results[0];
  const annualSavings = result?.estimatedSavings || 0;
  const co2Reduction = result?.co2Reduction || 0;
  const carsOffRoad = co2Reduction / 4.6;
  const totalFuelCost = result?.totalFuelCost || 0;
  const totalFuelConsumption = result?.totalFuelConsumption || 0;
  const fuelPrice = result?.fuelPrice || 0;
  const estimatedSavings = result?.estimatedSavings || 0;


  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Analysis Results</h2>
      <div className="grid gap-5">
        <Card className="bg-gradient-to-br from-[#175D8D] to-[#0D4A75] p-7 shadow-xl border-0">
          <div className="flex items-center gap-2.5 text-white/95">
            <DollarSign className="h-5 w-5" strokeWidth={2} />
            <span className="text-base font-semibold tracking-wide">Annual Savings</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-0.5 hover:bg-white/10 rounded-full transition-colors">
                  <Info className="h-4 w-4 cursor-help opacity-80 hover:opacity-100" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-[250px] space-y-2">
                  <p className="text-sm leading-snug">
                    These savings are calculated based on your fleet's fuel consumption and current VLSFO prices, incorporating Wayfinder's proven optimization algorithms.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-5">
            <div className="flex flex-col gap-1.5">
              <div className="text-4xl font-bold tracking-tight text-white">
                ${annualSavings.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-white/80">
                Projected Cost Reduction
              </div>
              <div className="text-sm leading-relaxed text-white/85 mt-4 font-medium">
                Based on your fleet's annual fuel consumption of {totalFuelConsumption.toLocaleString()} MT, 
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
              <TooltipTrigger asChild>
                <button className="p-0.5 hover:bg-slate-100 rounded-full transition-colors">
                  <Info className="h-4 w-4 cursor-help opacity-80 hover:opacity-100" />
                </button>
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
              <div className="text-2xl font-bold tracking-tight">${totalFuelCost.toLocaleString()}</div>
              <div className="bg-slate-50 p-4 rounded-lg mt-3 space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-700 mb-2">Fleet Breakdown:</div>
                  {result?.vessels?.map((vessel, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-slate-200 mb-3 last:mb-0">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-slate-800 flex items-center gap-2">
                            {vessel.type.includes('container-ship-small') ? (
                              <img src="/images/container_ship.png" alt="Container Ship (Feeder <3000 TEU)" className="h-6 w-6 object-contain" />
                            ) : vessel.type.includes('container-ship-medium') ? (
                              <img src="/images/container_ship.png" alt="Container Ship (Panamax 3000-5000 TEU)" className="h-8 w-8 object-contain" />
                            ) : vessel.type.includes('container-ship-large') ? (
                              <img src="/images/container_ship.png" alt="Container Ship (Post-Panamax >5000 TEU)" className="h-10 w-10 object-contain" />
                            ) : vessel.type.includes('bulk-carrier-small') ? (
                              <img src="/images/bulk_carrier.png" alt="Bulk Carrier (Handysize)" className="h-7 w-7 object-contain" />
                            ) : vessel.type.includes('bulk-carrier-large') ? (
                              <img src="/images/bulk_carrier.png" alt="Bulk Carrier (Panamax)" className="h-10 w-10 object-contain" />
                            ) : vessel.type.includes('tanker-small') ? (
                              <img src="/images/oil_tanker.png" alt="Oil Tanker (Medium Range)" className="h-7 w-7 object-contain" />
                            ) : vessel.type.includes('tanker-large') ? (
                              <img src="/images/oil_tanker.png" alt="Oil Tanker (VLCC)" className="h-10 w-10 object-contain" />
                            ) : (
                              <Ship className="h-4 w-4" />
                            )}
                            {vessel.count} × {
                              vessel.type === 'container-ship-small' ? 'Container Ship (Feeder <3000 TEU)' :
                              vessel.type === 'container-ship-medium' ? 'Container Ship (Panamax 3000-5000 TEU)' :
                              vessel.type === 'container-ship-large' ? 'Container Ship (Post-Panamax >5000 TEU)' :
                              vessel.type === 'bulk-carrier-small' ? 'Bulk Carrier (Handysize)' :
                              vessel.type === 'bulk-carrier-large' ? 'Bulk Carrier (Panamax)' :
                              vessel.type === 'tanker-small' ? 'Oil Tanker (Medium Range)' :
                              vessel.type === 'tanker-large' ? 'Oil Tanker (VLCC)' :
                              'Custom Vessel Type'
                            }
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-slate-600">Daily Fuel Consumption:</div>
                          <div className="text-right font-medium">{vessel.fuelConsumption} MT/day</div>

                          <div className="text-slate-600">Days at Sea per Year:</div>
                          <div className="text-right font-medium">{vessel.seaDaysPerYear} days</div>

                          <div className="text-slate-600">Annual Consumption:</div>
                          <div className="text-right font-medium">
                            {(vessel.fuelConsumption * vessel.seaDaysPerYear * vessel.count).toLocaleString()} MT
                          </div>

                          <div className="text-slate-600">Annual Fuel Cost:</div>
                          <div className="text-right font-medium text-slate-800">
                            ${(vessel.fuelConsumption * vessel.seaDaysPerYear * vessel.count * fuelPrice).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-slate-600 font-medium flex items-center gap-1">
                        Fuel Price:
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-0.5 hover:bg-slate-100 rounded-full transition-colors">
                              <Info className="h-3.5 w-3.5 cursor-help opacity-70 hover:opacity-100" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[300px] text-sm">
                              VLSFO Fuel Type: Calculations use Very Low Sulfur Fuel Oil (VLSFO) prices, which is the primary marine fuel used to comply with IMO 2020 sulfur regulations.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-right font-medium">${fuelPrice.toLocaleString()}/MT</div>

                      <div className="text-slate-600 font-medium">Total Annual Consumption:</div>
                      <div className="text-right font-medium">{totalFuelConsumption.toLocaleString()} MT</div>

                      <div className="text-slate-700 font-semibold">Total Annual Fuel Cost:</div>
                      <div className="text-right font-semibold">${totalFuelCost.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[1px] bg-slate-200 my-4" />
            <div>
              <div className="text-sm text-slate-600">Cost with Wayfinder:</div>
              <div className="text-2xl font-bold tracking-tight text-emerald-600">
                ${(totalFuelCost - annualSavings).toLocaleString()}
              </div>
              <div className="bg-slate-50 p-3 rounded-lg mt-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-600">Original Annual Cost:</div>
                  <div className="text-right font-medium">${totalFuelCost.toLocaleString()}</div>

                  <div className="text-slate-600">
                    Fuel Savings:
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-1 p-0.5 hover:bg-slate-100 rounded-full transition-colors">
                          <Info className="h-3.5 w-3.5 cursor-help opacity-70 hover:opacity-100" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[250px] text-sm">
                          The fuel savings percentage is estimated between 4% to 10%, based on typical results from Sofar Ocean's Wayfinder platform.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-right font-medium">5%</div>

                  <div className="text-slate-600">Amount Saved:</div>
                  <div className="text-right font-medium text-emerald-600">-${annualSavings.toLocaleString()}</div>

                  <div className="text-slate-700 font-semibold border-t border-slate-200 pt-1 mt-1">Final Annual Cost:</div>
                  <div className="text-right font-semibold text-emerald-700 border-t border-slate-200 pt-1 mt-1">
                    ${(totalFuelCost - annualSavings).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-500 mt-2">
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
              <TooltipTrigger asChild>
                <button className="p-0.5 hover:bg-white/10 rounded-full transition-colors cursor-help">
                  <Info className="h-4 w-4 opacity-80 hover:opacity-100" />
                </button>
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
            <p className="text-sm text-white/80 mt-2 leading-relaxed">
              Reducing fuel consumption by {(totalFuelConsumption * 0.05).toFixed(0)} MT annually prevents {Math.round(co2Reduction).toLocaleString()} MT of CO₂ emissions, equivalent to taking {Math.round(carsOffRoad).toLocaleString()} cars off the road for a year.
            </p>
            <div className="mt-3 space-y-1 text-sm border-t border-emerald-100 pt-2">
              <div className="flex justify-between text-white/70">
                <span>Annual Fuel Consumption</span>
                <span>{formatNumber(totalFuelConsumption)} MT</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Estimated Reduction ({estimatedSavings}%)</span>
                <span>{formatNumber(totalFuelConsumption * (estimatedSavings / 100))} MT</span>
              </div>
              <div className="flex justify-between font-medium text-white">
                <span>Total CO₂ Reduction</span>
                <span>{formatNumber(co2Reduction)} MT</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}