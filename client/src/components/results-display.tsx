import { Card } from "@/components/ui/card";
import { CalculationResult, vesselCategories, vesselDisplayNames, vesselIconSizes } from "@shared/schema";
import { DollarSign, Info, LeafIcon, TrendingDown, Car, ChevronDown, Ship } from "lucide-react"; 
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"; 
import { InfoTooltip } from "@/components/info-tooltip";


interface ResultsDisplayProps {
  results: CalculationResult[];
}

const formatNumber = (num: number) => {
  if (num > 1000000) {
    return Math.round(num / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' M';
  }
  return Math.round(num).toLocaleString(undefined, { maximumFractionDigits: 0 });
};

// Get vessel display name from the schema
const getVesselDisplayName = (category: string, size: string): string => {
  if (vesselDisplayNames[category as keyof typeof vesselDisplayNames]) {
    const categoryNames = vesselDisplayNames[category as keyof typeof vesselDisplayNames];
    const displayName = categoryNames[size as keyof typeof categoryNames];
    if (displayName) {
      return displayName;
    }
  }
  return size.charAt(0).toUpperCase() + size.slice(1);
};

// Get vessel icon size from the schema
const getVesselIconSize = (category: string, size: string): string => {
  if (vesselIconSizes[category as keyof typeof vesselIconSizes]) {
    const categorySizes = vesselIconSizes[category as keyof typeof vesselIconSizes];
    const iconSize = categorySizes[size as keyof typeof categorySizes];
    if (iconSize) {
      return iconSize;
    }
  }
  return 'h-8 w-8'; // Default size
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
    <TooltipProvider>
    <div className="max-w-4xl space-y-6">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Analysis Results</h2>
      <div className="grid gap-5">
        <Card className="bg-gradient-to-br from-[#175D8D] to-[#0D4A75] p-7 shadow-xl border-0">
          <div className="flex items-center gap-2.5 text-white/95">
            <DollarSign className="h-5 w-5" strokeWidth={2} />
            <span className="text-base font-semibold tracking-wide">Annual Savings</span>
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

        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 shadow-xl border-0">
          <div className="flex items-center gap-2 text-white/95">
            <LeafIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Environmental Impact</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{Math.round(co2Reduction).toLocaleString()} MT</div>
            <div className="text-white/90 font-medium text-sm">Annual CO₂ Reduction</div>

            <Collapsible className="mt-3 w-full">
              <CollapsibleTrigger className="flex items-center w-full justify-between text-sm font-medium bg-emerald-800/40 py-2.5 px-3 rounded-md border border-emerald-600/30 hover:bg-emerald-800/60 transition-colors text-white/90">
                <span>Calculation Details</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 text-sm pt-2 animate-accordion-down">
                <div className="flex justify-between text-white/80">
                  <span>Annual Fuel Consumption</span>
                  <span>{formatNumber(totalFuelConsumption)} MT</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Estimated Fuel Reduction (5%)</span>
                  <span>{formatNumber(totalFuelConsumption * 0.05)} MT</span>
                </div>
                <div className="flex justify-between text-white items-center mt-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">CO₂ Reduction</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-0.5 hover:bg-white/10 rounded-full transition-colors">
                        <Info className="h-3.5 w-3.5 opacity-70 hover:opacity-100" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white border-blue-200 shadow-lg max-w-[300px] p-3">
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-900">How is this calculated?</h4>
                          <p className="text-sm text-slate-800 leading-snug">
                            For every ton of fuel saved, we reduce CO₂ emissions by 3.15 tons. This is based on standard maritime industry calculations - less fuel burned means fewer emissions released into the atmosphere.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-medium">{formatNumber(co2Reduction)} MT</span>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/80">
              <Car className="inline-block h-3.5 w-3.5 mr-1 -mt-0.5" /> This reduction is equivalent to taking {formatNumber(carsOffRoad)} cars off the road for a year.
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="rounded-full p-1 bg-slate-100">
              <Info className="h-4 w-4" />
            </div>
            <span className="text-base font-medium">Cost Breakdown</span>
          </div>
          <div className="mt-4">
            <div>
              <div className="text-sm text-slate-600">Current Annual Fuel Cost:</div>
              <div className="text-2xl font-bold tracking-tight">${totalFuelCost.toLocaleString()}</div>
              <Collapsible className="mt-3 space-y-2">
                <CollapsibleTrigger className="flex items-center w-full justify-between text-sm font-medium bg-slate-50 py-2.5 px-3 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors">
                  <span>Fleet Breakdown</span>
                  <ChevronDown className="h-4 w-4 text-primary transition-transform duration-200 data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {result?.vessels?.map((vessel, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-slate-200 mb-3 last:mb-0">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-slate-800 flex items-center gap-2">
                            {vessel.category === 'container-ship' ? (
                              <img 
                                src="/images/container_ship.png" 
                                alt="Container Ship" 
                                className={`${getVesselIconSize(vessel.category, vessel.size)} object-contain`}
                              />
                            ) : vessel.category === 'bulk-carrier' ? (
                              <img 
                                src="/images/bulk_carrier.png" 
                                alt="Bulk Carrier" 
                                className={`${getVesselIconSize(vessel.category, vessel.size)} object-contain`}
                              />
                            ) : vessel.category === 'oil-tanker' ? (
                              <img 
                                src="/images/oil_tanker.png" 
                                alt="Oil Tanker" 
                                className={`${getVesselIconSize(vessel.category, vessel.size)} object-contain`}
                              />
                            ) : vessel.category === 'ro-ro' ? (
                              <img 
                                src="/images/ro_ro_ship.png" 
                                alt="Ro-Ro Ship" 
                                className={`${getVesselIconSize(vessel.category, vessel.size)} object-contain`}
                              />
                            ) : vessel.category === 'cruise-ship' ? (
                              <img 
                                src="/images/cruise_ship.png" 
                                alt="Cruise Ship" 
                                className={`${getVesselIconSize(vessel.category, vessel.size)} object-contain`}
                              />
                            ) : (
                              <Ship className="h-4 w-4" />
                            )}
                            <div className="flex items-center">
                              <span className="text-sm">
        {vessel.count} × {vesselCategories[vessel.category as keyof typeof vesselCategories]} ({getVesselDisplayName(vessel.category, vessel.size)})
      </span>
                            </div>
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
                      <div className="text-slate-600 font-medium">
                        Fuel Price:
                        <InfoTooltip>
                          We use Very Low Sulfur Fuel Oil (VLSFO) prices in our calculations as it's the maritime industry standard fuel that complies with IMO 2020 emissions regulations, which limit sulfur content to 0.5%.
                        </InfoTooltip>
                      </div>
                      <div className="text-right font-medium">${fuelPrice.toLocaleString()}/MT</div>

                      <div className="text-slate-600 font-medium">Total Annual Consumption:</div>
                      <div className="text-right font-medium">{totalFuelConsumption.toLocaleString()} MT</div>

                      <div className="text-slate-700 font-semibold">Total Annual Fuel Cost:</div>
                      <div className="text-right font-semibold">${totalFuelCost.toLocaleString()}</div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            <div className="h-[1px] bg-slate-200 my-4" />
            <div>
              <div className="text-sm text-slate-600">Cost with Wayfinder:</div>
              <div className="text-2xl font-bold tracking-tight text-emerald-600">
                ${(totalFuelCost - annualSavings).toLocaleString()}
              </div>
              <Collapsible className="mt-3 space-y-2">
                <CollapsibleTrigger className="flex items-center w-full justify-between text-sm font-medium bg-slate-50 py-2.5 px-3 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors">
                  <span>Savings Breakdown</span>
                  <ChevronDown className="h-4 w-4 text-primary transition-transform duration-200 data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-600">Original Annual Cost:</div>
                    <div className="text-right font-medium">${totalFuelCost.toLocaleString()}</div>

                    <div className="text-slate-600">
                      Fuel Savings:
                      <InfoTooltip>
                        The fuel savings percentage is estimated between 4% to 10%, based on typical results from Sofar Ocean's Wayfinder platform.
                      </InfoTooltip>
                    </div>
                    <div className="text-right font-medium">5%</div>

                    <div className="text-slate-600">Amount Saved:</div>
                    <div className="text-right font-medium text-emerald-600">-${annualSavings.toLocaleString()}</div>

                    <div className="text-slate-700 font-semibold border-t border-slate-200 pt-1 mt-1">Final Annual Cost:</div>
                    <div className="text-right font-semibold text-emerald-700 border-t border-slate-200 pt-1 mt-1">
                      ${(totalFuelCost - annualSavings).toLocaleString()}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <div className="text-sm text-slate-500 mt-2">
                Optimized routing and operations could reduce your annual fuel spend by ${annualSavings.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 mt-5 shadow-xl border-0">
          <div className="flex items-center gap-2.5 text-white/95">
            <div className="rounded-full bg-blue-700/40 p-1.5">
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-wide">Real-World Success Stories</span>
          </div>
          <div className="mt-4">
            <p className="text-white/90 font-medium">
              2024 Savings Report: Major fuel savings achieved across global routes
            </p>
            <a 
              href="/download/2024-savings-report" 
              className="inline-flex items-center mt-3 text-sm text-white/80 hover:text-white group"
            >
              Download 2024 savings report 
              <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg] group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </Card>
      </div>
    </div>
    </TooltipProvider>
  );
}