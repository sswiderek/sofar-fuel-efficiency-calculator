import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CalculationResult } from "@shared/schema";
import { BanknoteIcon, LeafIcon, GlobeIcon } from 'lucide-react'; // Assumed import


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
    return [
      { 
        title: 'Current Costs',
        emoji: <BanknoteIcon className="h-4 w-4" />, // Replaced emoji
        value: formatCurrency(results[0].totalFuelCost),
        subtitle: 'Annual fuel expenditure',
        color: 'border-gray-200 bg-white'
      },
      { 
        title: 'Potential Savings',
        emoji: <LeafIcon className="h-4 w-4" />, // Replaced emoji
        value: formatCurrency(results[scenarioIndex].estimatedSavings),
        subtitle: 'With Wayfinder optimization',
        color: 'border-green-200 bg-green-50/50'
      },
      { 
        title: 'CO₂ Reduction',
        emoji: <LeafIcon className="h-4 w-4" />, // Replaced emoji
        value: formatNumber(results[scenarioIndex].co2Reduction) + ' MT',
        subtitle: 'Annual emissions saved',
        color: 'border-blue-200 bg-blue-50/50'
      },
      { 
        title: 'Optimized Cost',
        emoji: <BanknoteIcon className="h-4 w-4" />, // Replaced emoji
        value: formatCurrency(results[scenarioIndex].fuelCostWithWayfinder),
        subtitle: 'With Wayfinder routing',
        color: 'border-purple-200 bg-purple-50/50'
      }
    ];
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="average" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 p-1">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <TabsTrigger value={key} key={key} className="relative px-3 py-1.5 text-sm font-medium">
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
                  className={`transform transition-all duration-200 hover:scale-102 ${item.color} border-2 ${
                    item.title === 'Potential Savings' ? 'col-span-2 bg-green-100' : ''
                  }`}
                >
                  <CardContent className={`p-4 ${item.title === 'Potential Savings' ? 'py-6' : ''}`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${item.title === 'Potential Savings' ? 'text-base' : 'text-sm'} text-muted-foreground`}>
                          {item.title}
                        </p>
                        <span className={`${item.title === 'Potential Savings' ? 'text-2xl' : 'text-xl'}`}>
                          {item.emoji}
                        </span>
                      </div>
                      <p className={`${item.title === 'Potential Savings' ? 'text-3xl' : 'text-2xl'} font-bold tracking-tight`}>
                        {item.value}
                      </p>
                      <p className={`${item.title === 'Potential Savings' ? 'text-sm' : 'text-xs'} text-muted-foreground`}>
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