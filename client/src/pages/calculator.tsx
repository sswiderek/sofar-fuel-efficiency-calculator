import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorForm from "@/components/calculator-form";
import { WavesIcon } from "lucide-react";

export default function Calculator() {
  return (
    <div className="min-h-screen w-full p-4 md:p-8" style={{ 
      backgroundImage: 'url(/images/ocean.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-6xl mx-auto">
        <Card className="w-full shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8 border-b">
            <div className="flex items-center gap-2">
              <img src="/images/sofar-logo.png" alt="Sofar Logo" className="h-8 w-auto" />
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