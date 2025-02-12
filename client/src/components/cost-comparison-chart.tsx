import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import type { CalculationResult } from "@shared/schema";

interface CostComparisonChartProps {
  results: CalculationResult;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const value = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(payload[0].value);

    return (
      <div className="bg-white p-2 shadow-lg border rounded-lg">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-sm text-primary">{value}</p>
      </div>
    );
  }
  return null;
};

export default function CostComparisonChart({ results }: CostComparisonChartProps) {
  const data = [
    {
      name: 'Current Fuel Cost',
      value: results.totalFuelCost,
      fill: 'hsl(var(--primary) / 0.5)'
    },
    {
      name: 'Cost with Wayfinder',
      value: results.fuelCostWithWayfinder,
      fill: 'hsl(var(--primary))'
    }
  ];

  return (
    <Card className="w-full mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Fuel Cost Comparison</h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--foreground))' }}
                tickLine={{ stroke: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--foreground))' }}
                tickLine={{ stroke: 'hsl(var(--foreground))' }}
                tickFormatter={(value) => 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                    maximumFractionDigits: 1
                  }).format(value)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
