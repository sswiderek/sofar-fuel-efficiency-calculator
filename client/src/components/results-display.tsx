import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CalculationResult } from "@shared/schema";
import { BanknoteIcon, LeafIcon, GlobeIcon, DollarSignIcon, ArrowDownCircleIcon } from 'lucide-react';


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
      description: "A cautious 4% fuel savings estimate based on minimal route optimization and weather routing",
      data: getScenarioData(0)
    },
    average: {
      title: "Average",
      description: "Typical 6% fuel savings achieved by most vessels using standard weather routing and speed optimization",
      data: getScenarioData(1)
    },
    optimal: {
      title: "Optimal",
      description: "Maximum 8% fuel savings possible with full implementation of all optimization strategies and perfect compliance",
      data: getScenarioData(2)
    }
  };

  function getScenarioData(scenarioIndex: number) {
    const themes = {
        0: { // Conservative
          current: 'border-teal-300 bg-gradient-to-br from-teal-50 to-teal-100 text-teal-900',
          optimized: 'border-teal-400 bg-gradient-to-br from-teal-200 to-teal-300 text-teal-900',
          savings: 'bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-lg',
          reduction: 'border-teal-300 bg-gradient-to-br from-teal-100 to-teal-200 text-teal-900'
        },
        1: { // Average
          current: 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-900',
          optimized: 'border-indigo-400 bg-gradient-to-br from-indigo-200 to-indigo-300 text-indigo-900',
          savings: 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg',
          reduction: 'border-indigo-300 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-900'
        },
        2: { // Optimal
          current: 'border-sky-300 bg-gradient-to-br from-sky-50 to-sky-100 text-sky-900',
          optimized: 'border-sky-400 bg-gradient-to-br from-sky-200 to-sky-300 text-sky-900',
          savings: 'bg-gradient-to-br from-sky-600 to-sky-700 text-white shadow-lg',
          reduction: 'border-sky-300 bg-gradient-to-br from-sky-100 to-sky-200 text-sky-900'
        }
      };

    return [
      { 
        title: 'Current Costs',
        emoji: <BanknoteIcon className="h-4 w-4" />,
        value: formatCurrency(results[0].totalFuelCost),
        subtitle: 'Annual fuel expenditure',
        color: themes[scenarioIndex].current
      },
      { 
        title: 'Optimized Cost',
        emoji: <ArrowDownCircleIcon className="h-4 w-4" />,
        value: formatCurrency(results[scenarioIndex].fuelCostWithWayfinder),
        subtitle: 'With Wayfinder routing',
        color: themes[scenarioIndex].optimized
      },
      { 
        title: 'Potential Savings',
        emoji: <DollarSignIcon className="h-4 w-4" />,
        value: formatCurrency(results[scenarioIndex].estimatedSavings),
        subtitle: 'With Wayfinder optimization',
        color: themes[scenarioIndex].savings
      },
      { 
        title: 'CO₂ Reduction',
        emoji: <LeafIcon className="h-4 w-4" />,
        value: formatNumber(results[scenarioIndex].co2Reduction) + ' MT',
        subtitle: 'Annual emissions saved',
        color: themes[scenarioIndex].reduction
      }
    ];
  }

  return (
    <div className="space-y-4 pt-6">
      <Tabs defaultValue="average" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 p-1">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <TabsTrigger 
              value={key} 
              key={key} 
              className={cn(
                "relative px-3 py-1.5 text-sm font-medium transition-all duration-200",
                key === 'conservative' && 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-100 data-[state=active]:to-emerald-200 data-[state=active]:text-emerald-800 data-[state=active]:shadow-sm',
                key === 'average' && 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-100 data-[state=active]:to-violet-200 data-[state=active]:text-violet-800 data-[state=active]:shadow-sm',
                key === 'optimal' && 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-blue-200 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm'
              )}
            >
              {scenario.title}
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="h-4 w-4 ml-1 inline-block" />
                </TooltipTrigger>
                <TooltipContent>{scenario.description}</TooltipContent>
              </Tooltip>
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(scenarios).map(([key, scenario]) => (
          <TabsContent key={key} value={key}>
            <div className="grid grid-cols-2 gap-4">
              {scenario.data.map((item, i) => (
                <Card 
                  key={i} 
                  className={cn(
                    "border shadow-sm hover:shadow transition-shadow duration-200 animate-fade-in",
                    item.color
                  )}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-slate-700">
                          {item.title}
                        </p>
                        <span className="text-xl">
                          {item.emoji}
                        </span>
                      </div>
                      <p className="text-2xl font-bold tracking-tight text-slate-900">
                        {item.value}
                      </p>
                      <p className="text-xs text-slate-600">
                        {item.subtitle}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}