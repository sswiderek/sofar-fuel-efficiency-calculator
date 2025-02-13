import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorForm from "@/components/calculator-form";
import { Fuel, DollarSign, Leaf, Globe } from "lucide-react";

export default function Calculator() {
  return (
    <div className="min-h-screen w-full p-4 md:p-8" style={{ 
      backgroundImage: 'url(/images/ocean.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-6xl mx-auto">
        <Card className="w-full shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-slate-100">
          <CardHeader className="space-y-2 pb-4 border-b">
            <div className="flex items-center gap-4 py-3">
              <img src="/images/sofar-logo.png" alt="Sofar Logo" className="h-10 w-auto" />
              <div className="border-l pl-4 border-slate-200">
                <CardTitle className="text-2xl font-light tracking-tight text-slate-900">
                  Fuel Savings Calculator
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1 tracking-wide">
                  Estimate potential fuel cost savings and CO₂ emission reductions using Sofar Ocean's Wayfinder platform
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CalculatorForm />
            <div className="mt-8 flex justify-end">
              <Card className="w-72 transform transition-transform hover:scale-105 cursor-pointer bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-xl">
                <a href="https://www.sofarocean.com/posts/weather-maritime-shipping-white-paper" target="_blank" rel="noopener noreferrer">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-xl">Validate Your Savings</CardTitle>
                    <p className="text-lg text-blue-200">Case Study & Analysis</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed">See how leading shipping companies achieve 4-8% fuel savings using weather routing technology.</p>
                  </CardContent>
                </a>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}