
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
      subtitle: '(Baseline)',
      description: 'Your current annual fuel costs without optimization',
      color: 'border-gray-200 bg-white'
    },
    { 
      title: 'Conservative Savings',
      subtitle: '(4% Reduction)',
      description: 'Minimum expected savings with Wayfinder',
      color: 'border-blue-200 bg-blue-50'
    },
    { 
      title: 'Average Savings',
      subtitle: '(6% Reduction)',
      description: 'Typical savings achieved with Wayfinder',
      color: 'border-purple-200 bg-purple-50'
    },
    { 
      title: 'Optimal Savings',
      subtitle: '(8% Reduction)',
      description: 'Maximum potential savings with Wayfinder',
      color: 'border-green-200 bg-green-50'
    }
  ];

  // Calculate average savings (6%)
  const averageResult = {
    ...results[0],
    estimatedSavings: results[0].totalFuelCost * 0.06,
    co2Reduction: results[1].co2Reduction * 1.5
  };

  // Insert average result into the middle of the array
  const allResults = [
    results[0],
    results[1],
    averageResult,
    results[2]
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {allResults.map((result, index) => (
          <Card key={index} className={`transform transition-all duration-200 hover:scale-105 shadow-lg border-2 ${scenarios[index].color}`}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="min-h-[80px]">
                  <h3 className="text-lg font-semibold">{scenarios[index].title}</h3>
                  <p className="text-sm text-muted-foreground">{scenarios[index].subtitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">{scenarios[index].description}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Annual Fuel Cost</p>
                  <p className="text-xl font-bold break-words">{formatCurrency(result.totalFuelCost - result.estimatedSavings)}</p>
                  {index > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Save {formatCurrency(result.estimatedSavings)}/year
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CO₂ Reduction</p>
                  <p className="text-lg font-semibold">{formatNumber(result.co2Reduction)} MT/year</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
