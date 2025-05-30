import { Card } from "@/components/ui/card";
import { CalculationResult, vesselCategories, vesselDisplayNames, vesselIconSizes } from "@shared/schema";
import { DollarSign, Info, LeafIcon, TrendingDown, Car, ChevronDown, Ship, Share2 } from "lucide-react"; 
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"; 
import { InfoTooltip } from "@/components/info-tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";


interface ResultsDisplayProps {
  results: CalculationResult[];
  originalFormData?: any;
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


export default function ResultsDisplay({ results, originalFormData }: ResultsDisplayProps) {
  const { toast } = useToast();
  const [isCopying, setIsCopying] = useState(false);

  if (!results || results.length === 0) return null;

  const result = results[0];
  const annualSavings = result?.estimatedSavings || 0;
  const co2Reduction = result?.co2Reduction || 0;
  const carsOffRoad = co2Reduction / 4.6;
  const totalFuelCost = result?.totalFuelCost || 0;
  const totalFuelConsumption = result?.totalFuelConsumption || 0;
  const fuelPrice = result?.fuelPrice || 0;
  const estimatedSavings = result?.estimatedSavings || 0;
  const fuelCostWithWayfinder = result?.fuelCostWithWayfinder || 0;

  // Create a sharable link with calculation data
  const handleShare = () => {
    try {
      setIsCopying(true);
      
      // Create a shareable data object that contains all necessary information
      // Use the original form data passed from the calculator component if available
      const shareData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        vessels: result.vessels.map(vessel => ({
          category: vessel.category,
          size: vessel.size,
          count: Number(vessel.count),
          fuelConsumption: Number(vessel.fuelConsumption),
          seaDaysPerYear: Number(vessel.seaDaysPerYear)
        })),
        fuelPrice: Number(result.fuelPrice),
        estimatedSavings: 5, // Fixed at 5% in the calculator
        results: {
          totalFuelCost: result.totalFuelCost,
          estimatedSavings: result.estimatedSavings,
          fuelCostWithWayfinder: result.fuelCostWithWayfinder,
          co2Reduction: result.co2Reduction,
          totalFuelConsumption: result.totalFuelConsumption,
          fuelPrice: result.fuelPrice,
          vessels: result.vessels
        }
      };
      
      // Convert to a base64 URL-friendly string
      const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
      
      // Create the URL with the data
      const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied!",
          description: "Share this link to show your calculation results",
          variant: "default",
        });
      });
    } catch (error) {
      toast({
        title: "Error creating share link",
        description: "Could not create a shareable link",
        variant: "destructive",
      });
      console.error("Share error:", error);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <TooltipProvider>
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Analysis Results</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleShare} 
            disabled={isCopying}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#175D8D] to-[#0D4A75] hover:from-[#1A6BA3] hover:to-[#0F568A] text-white px-4 py-2 shadow-md rounded-md transition-all duration-200 transform hover:scale-[1.02]">
            <Share2 className="h-4 w-4 text-white/90" />
            <span className="font-medium tracking-wide text-sm">{isCopying ? "Copying..." : "Share Results"}</span>
          </Button>
        </div>
      </div>
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
                          <h4 className="font-medium text-slate-800">How is this calculated?</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            For every ton of fuel saved, CO₂ emissions are reduced by 3.15 tons. This is based on standard maritime industry calculations - less fuel burned means fewer emissions released into the atmosphere.
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
                          Based on Very Low Sulfur Fuel Oil (VLSFO) prices - the industry standard fuel required by IMO 2020 regulations for reduced emissions.
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
                        Based on data from over 1,000 voyages, vessels using Wayfinder's weather routing typically achieve 4-8% fuel savings. We use a conservative 5% estimate for these calculations to provide reliable projections.
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
              </div>
          </div>
        </Card>

        {/* Wayfinder Demo Request Button */}
        <Card className="bg-slate-50 p-7 border-2 border-emerald-500 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Ready to see Wayfinder in action?</h3>
              <p className="text-slate-600">Schedule a personalized demo to discover how Wayfinder can optimize your fleet operations and achieve the savings you've calculated above.</p>
            </div>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 shadow-md rounded-md transition-all duration-200 transform hover:scale-[1.02] font-medium"
              onClick={() => {
                // Track the demo request event
                const trackDemoClick = () => {
                  try {
                    // Create an analytics payload with calculation data
                    const analyticsData = {
                      totalFuelCost: totalFuelCost,
                      estimatedSavings: estimatedSavings,
                      fuelCostWithWayfinder: result.fuelCostWithWayfinder,
                      co2Reduction: co2Reduction,
                      totalFuelConsumption: totalFuelConsumption,
                      vesselCount: result.vessels.reduce((sum, v) => sum + v.count, 0),
                      timestamp: new Date().toISOString()
                    };
                    
                    // Log analytics data for debugging
                    console.log('Demo request click', analyticsData);
                    
                    // Store analytics data in localStorage for the dashboard
                    try {
                      // Get existing clicks or initialize empty array
                      const existingClicks = localStorage.getItem('demoClicks');
                      let clicks = existingClicks ? JSON.parse(existingClicks) : [];
                      
                      // Add new click data
                      clicks.push(analyticsData);
                      
                      // Store back in localStorage
                      localStorage.setItem('demoClicks', JSON.stringify(clicks));
                    } catch (storageError) {
                      console.error('Error storing demo click in localStorage:', storageError);
                    }
                    
                    // Send analytics data to backend (if we want to store this)
                    fetch('/api/track-demo-click', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(analyticsData)
                    }).catch(err => console.error('Failed to track demo click:', err));
                  } catch (error) {
                    console.error('Error tracking demo click:', error);
                  }
                };
                
                // Track the event
                trackDemoClick();
                
                // Add tracking parameters to the URL
                const baseUrl = 'https://www.sofarocean.com/signup/wayfinder-demo';
                const utmParams = new URLSearchParams({
                  utm_source: 'calculator',
                  utm_medium: 'app',
                  utm_campaign: 'fuel_savings_calculator',
                  utm_content: 'results_page',
                  savings_estimate: Math.round(estimatedSavings).toString()
                });
                
                // Open demo signup URL with tracking parameters
                window.open(`${baseUrl}?${utmParams.toString()}`, '_blank');
              }}
            >
              Request a Demo
            </Button>
          </div>

        </Card>

        {/* Success Stories Card */}
        <Card className="w-full bg-gradient-to-br from-blue-900 to-blue-800 text-white p-6 hover:from-blue-800 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl cursor-pointer border border-blue-700" onClick={() => window.open('https://www.sofarocean.com/posts/wayfinder-voyage-optimization-savings-report-2024', '_blank')}>
          <div className="flex items-center gap-4">
            <DollarSign className="h-8 w-8 text-blue-300" />
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Real-World Success Stories</h3>
              <p className="text-sm text-blue-100">2024 Savings Report: Major fuel savings achieved across global routes</p>
              <p className="text-sm text-blue-200 mt-2 flex items-center group">Download 2024 savings report <ChevronDown className="h-4 w-4 ml-1 rotate-270 group-hover:translate-x-1 transition-transform" /></p>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </TooltipProvider>
  );
}