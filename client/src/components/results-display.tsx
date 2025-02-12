
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
      title: 'Current Operations',
      subtitle: 'Baseline',
      description: 'Your current annual fuel costs',
      color: 'border-gray-200 bg-white'
    },
    { 
      title: 'Conservative',
      subtitle: '4% Reduction',
      description: 'Minimum expected savings',
      color: 'border-blue-200 bg-blue-50/50'
    },
    { 
      title: 'Average',
      subtitle: '6% Reduction',
      description: 'Typical savings achieved',
      color: 'border-purple-200 bg-purple-50/50'
    },
    { 
      title: 'Optimal',
      subtitle: '8% Reduction',
      description: 'Maximum potential savings',
      color: 'border-green-200 bg-green-50/50'
    }
  ];

  const allResults = [
    results[0],
    results[1],
    {
      ...results[0],
      estimatedSavings: results[0].totalFuelCost * 0.06,
      co2Reduction: results[1].co2Reduction * 1.5
    },
    results[2]
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {allResults.map((result, index) => (
          <Card 
            key={index} 
            className={`transform transition-all duration-200 hover:scale-102 ${scenarios[index].color} border-2`}
          >
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h3 className="text-xl font-bold mb-1">{scenarios[index].title}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{scenarios[index].subtitle}</p>
                </div>
                
                <div className="col-span-2 border-t pt-4">
                  <p className="text-4xl font-bold tracking-tight mb-2">
                    {formatCurrency(result.totalFuelCost - result.estimatedSavings)}
                  </p>
                  {index > 0 && (
                    <p className="text-base font-medium text-green-600">
                      Save {formatCurrency(result.estimatedSavings)}/year
                    </p>
                  )}
                </div>
                
                <div className="col-span-2 border-t pt-4">
                  <p className="text-2xl font-semibold mb-1">{formatNumber(result.co2Reduction)}</p>
                  <p className="text-sm text-muted-foreground">MT CO₂/year reduction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
