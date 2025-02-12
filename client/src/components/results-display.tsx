
import { Card, CardContent } from "@/components/ui/card";
import type { CalculationResult } from "@shared/schema";

interface Props {
  results: CalculationResult[];
}

export default function ResultsDisplay({ results }: Props) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('en-US').format(Math.round(value));

  const scenarios = [
    { 
      title: 'Current Costs',
      emoji: '💰',
      value: formatCurrency(results[0].totalFuelCost),
      subtitle: 'Annual fuel expenditure',
      color: 'border-gray-200 bg-white'
    },
    { 
      title: 'Potential Savings',
      emoji: '✨',
      value: formatCurrency(results[2].estimatedSavings),
      subtitle: 'With Wayfinder optimization',
      color: 'border-green-200 bg-green-50/50'
    },
    { 
      title: 'CO₂ Reduction',
      emoji: '🌱',
      value: formatNumber(results[2].co2Reduction) + ' MT',
      subtitle: 'Annual emissions saved',
      color: 'border-blue-200 bg-blue-50/50'
    },
    { 
      title: 'Optimized Cost',
      emoji: '📊',
      value: formatCurrency(results[2].fuelCostWithWayfinder),
      subtitle: 'With Wayfinder routing',
      color: 'border-purple-200 bg-purple-50/50'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {scenarios.map((scenario, index) => (
          <Card 
            key={index} 
            className={`transform transition-all duration-200 hover:scale-102 ${scenario.color} border-2`}
          >
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{scenario.title}</p>
                  <span className="text-xl">{scenario.emoji}</span>
                </div>
                <p className="text-2xl font-bold tracking-tight">
                  {scenario.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {scenario.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
