import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CalculationResult } from "@shared/schema";
import { TrendingUp, DollarSign, Leaf } from 'lucide-react';

interface Props {
  results: CalculationResult[];
}

export default function ResultsDisplay({ results }: Props) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(Math.round(value));

  const scenarios = {
    conservative: {
      title: "Conservative",
      data: getScenarioData(0)
    },
    average: {
      title: "Average",
      data: getScenarioData(1)
    },
    optimal: {
      title: "Optimal",
      data: getScenarioData(2)
    }
  };

  function getScenarioData(scenarioIndex: number) {
    const savings = results[scenarioIndex].estimatedSavings;
    const totalCost = results[scenarioIndex].totalFuelCost;
    const optimizedCost = results[scenarioIndex].fuelCostWithWayfinder;
    const savingsPercent = (savings / totalCost) * 100;

    return {
      currentCost: totalCost,
      optimizedCost: optimizedCost,
      savings: savings,
      co2Reduction: results[scenarioIndex].co2Reduction,
      improvement: savingsPercent.toFixed(0)
    };
  }

  return (
    <div className="space-y-4 pt-6">
      <Card className="border bg-white shadow-sm">
        <CardContent className="p-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-slate-600">Current Annual Costs</h3>
              <Tooltip>
                <TooltipTrigger>
                  <InfoCircledIcon className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent className="w-60">
                  Based on <span className="font-bold">{formatNumber(results[0].totalFuelConsumption)}</span> MT of fuel consumed annually by your fleet
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-2xl font-bold tracking-tight">{formatCurrency(results[0].totalFuelCost)}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="average" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <TabsTrigger 
              value={key} 
              key={key} 
              className={cn(
                "text-sm font-medium",
                key === "conservative" && "data-[state=active]:bg-sky-100 data-[state=active]:text-sky-900",
                key === "average" && "data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900",
                key === "optimal" && "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
              )}
            >
              {scenario.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(scenarios).map(([key, scenario]) => (
          <TabsContent key={key} value={key} className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              <Card className={cn(
                "border shadow-sm",
                key === "conservative" && "bg-sky-50",
                key === "average" && "bg-orange-50",
                key === "optimal" && "bg-emerald-50"
              )}>
                <CardContent className="p-2.5">
                  <div className="space-y-1">
                    <div className={cn(
                      "flex items-center gap-1",
                      key === "conservative" && "text-sky-700",
                      key === "average" && "text-amber-700",
                      key === "optimal" && "text-emerald-700"
                    )}>
                      <DollarSign className="h-3.5 w-3.5" />
                      <h3 className="text-sm font-medium">Optimized Cost</h3>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(scenario.data.optimizedCost)}</p>
                    <p className={cn(
                      "text-[11px] font-medium",
                      key === "conservative" && "text-sky-700",
                      key === "average" && "text-amber-700",
                      key === "optimal" && "text-emerald-700"
                    )}>
                      <TrendingUp className="h-2.5 w-2.5 inline mr-1" />
                      {scenario.data.improvement}% improvement
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className={cn(
                "border shadow-sm text-white",
                key === "conservative" && "bg-sky-700",
                key === "average" && "bg-orange-700",
                key === "optimal" && "bg-emerald-700"
              )}>
                <CardContent className="p-2.5">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Potential Savings</h3>
                    <p className="text-lg font-bold">{formatCurrency(scenario.data.savings)}</p>
                    <p className="text-[11px]">Annual savings</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className={cn(
              "mt-2 border shadow-sm",
              key === "conservative" && "bg-sky-50/50",
              key === "average" && "bg-orange-50/50",
              key === "optimal" && "bg-emerald-50/50"
            )}>
              <CardContent className="p-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-emerald-700">
                    <Leaf className="h-3.5 w-3.5" />
                    <h3 className="text-sm font-medium">CO₂ Reduction</h3>
                  </div>
                  <p className="text-lg font-bold text-emerald-800">{formatNumber(scenario.data.co2Reduction)} MT</p>
                  <p className="text-[11px] text-emerald-600">Annual emissions saved</p>
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] text-emerald-600">≈ {formatNumber(scenario.data.co2Reduction * 0.217)} cars off the road</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircledIcon className="h-3 w-3 text-emerald-600" />
                      </TooltipTrigger>
                      <TooltipContent className="w-60">
                        Equivalent to removing this many passenger vehicles from the road for one year, based on average annual vehicle emissions of 4.6 metric tons of CO₂ (EPA, 2023)
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}