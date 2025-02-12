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
        <Card className="w-full shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8 border-b bg-gradient-to-r from-blue-50/95 to-cyan-50/95">
            <div className="flex items-center gap-3 py-4">
              <img src="/images/sofar-logo.png" alt="Sofar Logo" className="h-10 w-auto" />
              <div>
                <CardTitle className="text-3xl font-bold text-slate-800">
                  Fuel Savings Calculator
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Estimate potential fuel cost savings and CO₂ emission reductions using Sofar Ocean's Wayfinder platform
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CalculatorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}