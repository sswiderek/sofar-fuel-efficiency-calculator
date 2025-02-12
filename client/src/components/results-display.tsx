import { Card, CardContent } from "@/components/ui/card";
import type { CalculationResult } from "@shared/schema";
import { motion } from "framer-motion";

interface Props {
  results: CalculationResult[];
}

export default function ResultsDisplay({ results }: Props) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('en-US').format(Math.round(value));

  const scenarios = [
    {
      title: '💰 Annual Cost Savings',
      subtitle: 'Baseline fuel costs',
      description: 'Potential savings with optimal routing',
      result: (result: CalculationResult) => formatCurrency(result.estimatedSavings),
      color: 'border-green-200 bg-white'
    },
    {
      title: '⚡ CO₂ Reduction',
      subtitle: 'Annual emissions reduction',
      description: 'Metric tons of CO₂ saved per year',
      result: (result: CalculationResult) => `${formatNumber(result.co2Reduction)} MT/year`,
      color: 'border-blue-200 bg-white'
    }
  ];

  const optimal = results[2]; // Using the optimal scenario results

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {scenarios.map((scenario, index) => (
        <Card 
          key={index}
          className={`transform transition-all duration-200 hover:scale-102 ${scenario.color} border-2 shadow-lg`}
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight">{scenario.title}</h3>
              <div className="space-y-2">
                <p className="text-4xl font-bold tracking-tight text-green-600">
                  {scenario.result(optimal)}
                </p>
                <p className="text-muted-foreground">{scenario.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}