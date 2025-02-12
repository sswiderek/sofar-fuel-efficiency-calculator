import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorForm from "@/components/calculator-form";
import { WavesIcon } from "lucide-react";

export default function Calculator() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <WavesIcon className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-bold">
                Fuel Savings Calculator
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Estimate potential fuel cost savings and CO₂ emission reductions using Sofar Ocean's Wayfinder platform
            </p>
          </CardHeader>
          <CardContent>
            <CalculatorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}