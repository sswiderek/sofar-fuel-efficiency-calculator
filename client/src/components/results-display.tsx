
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import type { CalculationResult } from "@shared/schema";

interface Props {
  results: CalculationResult[];
}

export default function ResultsDisplay({ results }: Props) {
  console.log("ResultsDisplay received:", results);
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('en-US').format(Math.round(value));

  const scenarios = [
    { 
      title: 'Current Operations',
      subtitle: '(Baseline)',
      description: 'Your current fuel costs without optimization'
    },
    { 
      title: 'Conservative Savings',
      subtitle: '(4% Reduction)',
      description: 'Expected minimum savings with Wayfinder'
    },
    { 
      title: 'Optimal Savings',
      subtitle: '(8% Reduction)',
      description: 'Potential savings with optimal route optimization'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        {results.map((result, index) => (
          <Card key={index} className={`transform transition-all duration-200 hover:scale-105 shadow-lg ${
            index === 0 ? 'bg-white border-2 border-gray-200' :
            index === 1 ? 'bg-blue-50 border-2 border-blue-200' :
            'bg-green-50 border-2 border-green-200'
          }`}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="min-h-[80px]">
                  <h3 className="text-lg font-semibold">{scenarios[index].title}</h3>
                  <p className="text-sm text-muted-foreground">{scenarios[index].subtitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">{scenarios[index].description}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Annual Fuel Cost</p>
                  <p className="text-xl font-bold break-words">{formatCurrency(result.totalFuelCost - result.estimatedSavings)}</p>
                  {index > 0 && (
                    <p className="text-sm text-green-600">
                      Save {formatCurrency(result.estimatedSavings)}/year
                    </p>
                  )}
                </div>
                {index > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">CO₂ Reduction</p>
                    <p className="text-lg font-semibold">{formatNumber(result.co2Reduction)} MT/year</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
