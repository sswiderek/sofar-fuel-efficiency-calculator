
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorForm from "@/components/calculator-form";
import { WavesIcon, Fuel as FuelIcon, DollarSign as DollarSignIcon, LeafIcon, Globe as GlobeIcon } from "lucide-react";

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
            <div className="mb-8 p-4 bg-gradient-to-r from-sky-50 to-white border border-sky-100 rounded-lg">
              <h2 className="text-lg font-medium text-slate-900 mb-2">How it works</h2>
              <div className="space-y-3 text-sm text-slate-600">
                <p>This calculator helps you estimate potential fuel savings and environmental impact using Sofar's Wayfinder platform:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Enter your fleet details and current fuel usage</li>
                  <li>View savings scenarios based on real-world data</li>
                  <li>Compare cost reductions and CO₂ savings across different optimization levels</li>
                </ul>
              </div>
            </div>
            <CalculatorForm />
            <div className="mt-8 flex justify-end">
              <Card className="transform transition-transform hover:scale-105 cursor-pointer bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-xl">
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
