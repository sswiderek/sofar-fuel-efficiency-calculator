import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Leaf, Ship } from "lucide-react";
import type { CalculationResult } from "@shared/schema";

interface Props {
  results: CalculationResult[];
}

export default function ResultsDisplay({ results }: Props) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('en-US').format(Math.round(value));

  const scenarios = ['Conservative', 'Average', 'Optimal'];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {results.map((result, index) => (
          <Card key={index} className={`bg-gradient-to-r ${
            index === 0 ? 'from-blue-50 to-blue-100' :
            index === 1 ? 'from-green-50 to-green-100' :
            'from-purple-50 to-purple-100'
          }`}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{scenarios[index]} Scenario</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Annual Savings</p>
                  <p className="text-2xl font-bold">{formatCurrency(result.estimatedSavings)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CO₂ Reduction</p>
                  <p className="text-xl font-semibold">{formatNumber(result.co2Reduction)} MT</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}