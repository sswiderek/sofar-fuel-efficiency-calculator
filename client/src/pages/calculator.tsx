import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorForm from "@/components/calculator-form";
import { WavesIcon } from "lucide-react";

export default function Calculator() {
  return (
    <div className="min-h-screen w-full p-4 md:p-8" style={{ 
      backgroundImage: 'url(/public/images/ocean.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="max-w-4xl mx-auto">
        <Card className="w-full shadow-lg bg-white/95">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <img src="/public/images/sofar-logo.png" alt="Sofar Logo" className="h-8 w-auto" />
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