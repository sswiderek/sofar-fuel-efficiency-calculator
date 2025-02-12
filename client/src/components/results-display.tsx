import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Leaf, Ship } from "lucide-react";
import type { CalculationResult } from "@shared/schema";
import CostComparisonChart from "./cost-comparison-chart";

interface ResultsDisplayProps {
  results: CalculationResult;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Fuel Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(results.totalFuelCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Ship className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">With Wayfinder</p>
                <p className="text-2xl font-bold">{formatCurrency(results.fuelCostWithWayfinder)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">CO₂ Reduction</p>
                <p className="text-2xl font-bold">{formatNumber(results.co2Reduction)} MT</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CostComparisonChart results={results} />

      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Estimated Annual Savings</h3>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(results.estimatedSavings)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}