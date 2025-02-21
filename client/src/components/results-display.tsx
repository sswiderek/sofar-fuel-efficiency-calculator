import { Card } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface ResultsDisplayProps {
  fuelPrice: number;
  fuelSaved: number;
  co2Reduced: number;
}

export default function ResultsDisplay({ fuelPrice, fuelSaved, co2Reduced }: ResultsDisplayProps) {
  const moneySaved = fuelPrice * fuelSaved;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-2">Fuel Savings</h3>
        <p className="text-2xl font-bold">{formatNumber(fuelSaved)} MT</p>
      </Card>
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-2">Money Saved</h3>
        <p className="text-2xl font-bold">{formatCurrency(moneySaved)}</p>
      </Card>
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-2">CO2 Reduced</h3>
        <p className="text-2xl font-bold">{formatNumber(co2Reduced)} MT</p>
      </Card>
    </div>
  );
}