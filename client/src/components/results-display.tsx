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
          current: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100',
          optimized: 'border-emerald-200 bg-gradient-to-br from-emerald-100 to-emerald-200',
          savings: 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg',
          reduction: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100'
        },
        1: { // Average
          current: 'border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100',
          optimized: 'border-violet-200 bg-gradient-to-br from-violet-100 to-violet-200',
          savings: 'bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-lg',
          reduction: 'border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100'
        },
        2: { // Optimal
          current: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100',
          optimized: 'border-blue-200 bg-gradient-to-br from-blue-100 to-blue-200',
          savings: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg',
          reduction: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100'
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