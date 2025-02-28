
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EnvironmentalMetricsProps {
  annualFuelConsumption: number;
  estimatedFuelReduction: number;
  co2Reduction: number;
  carsOffRoad?: number;
}

export function EnvironmentalMetrics({
  annualFuelConsumption,
  estimatedFuelReduction,
  co2Reduction,
  carsOffRoad
}: EnvironmentalMetricsProps) {
  return (
    <div className="bg-emerald-700 text-white rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Environmental Impact</h3>
        <CollapsibleTrigger className="flex items-center gap-1 hover:text-emerald-200 transition-colors">
          <span className="text-sm">Details</span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200 ui-open:rotate-180" />
        </CollapsibleTrigger>
      </div>
      
      <Collapsible>
        <CollapsibleContent className="mt-3 space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-emerald-100">Annual Fuel Consumption</div>
            <div>{annualFuelConsumption.toLocaleString()} MT</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-emerald-100">Estimated Fuel Reduction (5%)</div>
            <div>{estimatedFuelReduction.toLocaleString()} MT</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-100">CO₂ Reduction</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="inline-flex" aria-label="More information about CO2 reduction calculation">
                    <Info className="h-3.5 w-3.5 opacity-70 hover:opacity-100" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-[280px] space-y-2">
                    <h4 className="text-sm font-medium mb-1.5">How is this calculated?</h4>
                    <p className="text-sm leading-relaxed">
                      For every ton of fuel saved, we reduce CO₂ emissions by 3.15 tons. This is based on standard maritime industry calculations - less fuel burned means fewer emissions released into the atmosphere.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="font-medium">{co2Reduction.toLocaleString()} MT</div>
          </div>
          
          {carsOffRoad && (
            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/80">
              This reduction is equivalent to taking {carsOffRoad.toLocaleString()} cars off the road for a year.
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
