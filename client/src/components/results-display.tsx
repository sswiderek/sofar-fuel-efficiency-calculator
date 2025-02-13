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
      title: "Expected",
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
        <CardContent className="p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-slate-600">Current Annual Costs</h3>
            <p className="text-4xl font-bold tracking-tight">{formatCurrency(results[0].totalFuelCost)}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="average" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-50 p-1">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <TabsTrigger 
              value={key} 
              key={key} 
              className="text-sm font-medium data-[state=active]:bg-white"
            >
              {scenario.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(scenarios).map(([key, scenario]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-600">
                      <DollarSign className="h-5 w-5" />
                      <h3 className="text-lg font-medium">Optimized Cost</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{formatCurrency(scenario.data.optimizedCost)}</p>
                    <p className="text-sm font-medium text-blue-600">
                      <TrendingUp className="h-4 w-4 inline mr-1" />
                      {scenario.data.improvement}% improvement
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border bg-[#003D7C] text-white shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Potential Savings</h3>
                    <p className="text-3xl font-bold">{formatCurrency(scenario.data.savings)}</p>
                    <p className="text-sm">Annual savings</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4 border bg-emerald-50 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Leaf className="h-5 w-5" />
                    <h3 className="text-lg font-medium">CO₂ Reduction</h3>
                  </div>
                  <p className="text-3xl font-bold text-emerald-800">{formatNumber(scenario.data.co2Reduction)} MT</p>
                  <p className="text-sm text-emerald-600">Annual emissions saved</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}