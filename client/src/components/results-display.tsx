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
      title: 'Annual Cost Savings',
      emoji: '💰',
      value: formatCurrency(results[2].estimatedSavings),
      subtitle: 'Maximum potential savings',
      color: 'border-green-200 bg-green-50/50'
    },
    { 
      title: 'Labor Hours Saved',
      emoji: '⏰',
      value: '240 hrs/year',
      subtitle: 'Time saved through automation',
      color: 'border-blue-200 bg-blue-50/50'
    },
    { 
      title: 'Monthly Impressions',
      emoji: '👥',
      value: '9,583,333',
      subtitle: 'Expected with optimization',
      color: 'border-purple-200 bg-purple-50/50'
    },
    { 
      title: 'ROI Multiple',
      emoji: '🚀',
      value: '18.0x',
      subtitle: 'Return on investment ratio',
      color: 'border-amber-200 bg-amber-50/50'
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